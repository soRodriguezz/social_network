'use strict'

const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const user = require('../models/user');
const mongoosePaginate = require('mongoose-pagination');
//libreria filesystem de nodejs
const fs = require('fs');
// permite trabajar con rutas del filesystem
const path = require('path');
const { exists } = require('../models/user');

function home(req, res) {
    res.status(200).send({ message: 'Raiz del proyecto'});
}

function pruebas(req, res) {
    res.status(200).send({ message: 'Ruta test'});
}

// Registrar usuario
function saveUser(req, res) {
    const params = req.body;
    const user = new User();

    if(params.name && params.surname && params.nick && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        //Validar que el email o usuario no existan
        User.find({ $or: [
            { email: user.email.toLowerCase() },
            { nick: user.nick.toLowerCase() }
        ]}).exec((err, users) => {
            if(err) return res.status(500).send({ message: 'Error en la peticion de usuarios' });
            if(users && users.length >= 1){
                return res.status(200).send({ message: 'Usuario ya registrado' })
            } else {
                // Encriptar contraseña
                bcrypt.hash(params.password, null, null, (err, hash) => {
                user.password = hash;
                user.save((err, userStored) => {
                    if(err) return res.status(500).send({ message: 'Error al guardar el usuario'});

                    if(userStored){
                        res.status(200).send({ user: userStored });
                    } else {
                        res.status(404).send({ message: 'No se ha registrado el usuario'});
                    }
                });
            });
            }
        });
    } else {
        res.status(200).send({ message: 'Envia todos los campos'});
    }
}

// Validacion logueo usuario
function loginUser (req, res) {
    const params = req.body;
    const email = params.email;
    const password = params.password;

    // Buscar si el usuario con esa email existe
    User.findOne({ email: email }, (err, user) => {
        if(err) return res.status(500).send({ message: 'Error en la peticion' });
        if(user){
            // Compara la password que le estoy pasando versus la password que tengo cifrada y ver si existe
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    if(params.gettoken) {
                        // Devolver token del usuario
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        // Evito enviar la contraseña encriptada como JSON
                        user.password = undefined;
                        // Devolver datos del usuario
                        return res.status(200).send({ user });
                    }
                } else {
                    return res.status(404).send({ message: 'El usuario no se ha podido identificar'});
                }
            })
        } else {
            return res.status(404).send({ message: 'No existe un usuario con este email'});
        }
    });
}

// Obtener datos de un usuario
function getUser(req, res) {
    // dato desde la URL
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
        if(err) return res.status(500).send({ message: 'Error en la peticion' });
        if(!user) return res.status(404).send({ message: 'El usuario no existe' });
        return res.status(200).send({ user });
    });
}

// Obtener listado de usuarios paginados
function getUsers(req, res) {
    const identity_user_id = req.user.sub;
    var page = 1;
    if(req.params.page) {
        page = req.params.page;
    }
    var itemPerPage = 5;
    User.find().sort('_id').paginate(page, itemPerPage, (err, users, total) => {
        if(err) return res.status(500).send({ message: 'Error en la peticion' });
        if(!users) return res.status(404).send({ message: 'No hay usuarios disponibles' });
        // total de paginas que van a existir
        return res.status(200).send({ users, total, pages: Math.ceil(total/itemPerPage) });
    });
}

// Editar usuario
function updateUser(req, res){
    const userId = req.params.id;
    const update = req.body;
    //borrar propiedad password
    delete update.password;
    // Ve si el usuario que estoy modificando soy yo
    if(userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para actualizar los datos del usuario' });
    }
    // Busca y actualiza los datos, new devuelve el objeto actualizado
    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
       if(err) return res.status(500).send({ message: 'Error en la peticion' });
       if(!userUpdated) return res.status(404).send({ message: 'No existe el usuario' });
       return res.status(200).send({ user: userUpdated });
    });
}

//Subir imagenes de usuario
function uploadImage(req, res) {
    const userId = req.params.id;
    if(req.files) {
        const file_path = req.files.image.path;
        // cortar barras invertidas y solo mostrar el nombre de la imagen
        const file_split = file_path.split('\\');
        const file_name = file_split[2];
        console.log(file_name);
        // obtiene la extension de la imagen y cortar el '.'
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];
        console.log(file_ext);

        if(userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar la imagen del usuario');
        }

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {
            // Actualizar documento de usuario logueado
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if(err) return res.status(500).send({ message: 'Error en la peticion' });
                if(!userUpdated) return res.status(404).send({ message: 'No existe el usuario' });
                return res.status(200).send({ user: userUpdated });
            });
        } else {
            return removeFilesOfUploads(res, file_path, 'Extension no valida');
        }
    } else {
        return res.status(200).send({ message: 'No se han subido imagenes '});
    }
}
// Elimina la imagen si no se envia correctamente
function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    })
}

// Devolver imagenes del usuario
function getImageFile(req, res) {
    const image_file = req.params.imageFile;
    const path_file = './uploads/users/'+image_file;

    fs.exists(path_file, (exists) => {
        if(exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    });
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}