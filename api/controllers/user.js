'use strict'

var bcrypt = require('bcrypt-nodejs')
var User = require('../models/user');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');

//metodos de prueba
function home(req, res) {
    res.status(200).send({
        message: 'HOME'
    });
}

function pruebas(req, res) {
    res.status(200).send({
        message: 'Accion de pruebas en el servidor'
    });
}
// Registrar usuario
function saveUser(req, res) {
    var user = new User();
    var params = req.body;
    // Validar que ingrese todos los campos
    if (params.name && params.surname && params.nick && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        // Validar que no exista otro usuario en los registros (duplicados)
        User.find({
            // metodo 'or' en mongo para referirse a ó
            $or: [
                    { email: user.email.toLowerCase() },
                    { nick: user.nick.toLowerCase() }
                ]
                // exec para ejecutar callback
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'error en la peticion de usuarios' });

            if (users && users.length >= 1) {
                return res.status(200).send({ message: 'El usuario que intenta registrar ya existe' })
            } else {
                // Encriptar contraseña y guardar datos
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStored) => {
                        // Error en caso de guardar el usuario
                        if (err) return res.status(500).send({ message: 'Error al guardar el usuario' });
                        // Encriptada la contraseña correctamente y el usuario guardado
                        if (userStored) {
                            // Devuelve todos los datos que agregamos de los usuarios
                            res.status(200).send({ user: userStored });
                        } else {
                            res.status(404).send({ message: 'No se ha registrado el usuario' });
                        }
                    });
                });
            }
        });

    } else {
        // en caso de que falten campos requeridos sin rellenar
        res.status(200).send({ message: 'rellena todos los campos' });
    }
}
// login del usuario
function loginUser(req, res) {
    // recoger parametros que lleguen por POST
    var params = req.body;

    var email = params.email;
    var password = params.password;
    // Ver que el email que ingreso exista en la BD, usando un AND
    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        // si llega el usuario, ver si la password que me llega pertenece a la que tengo en la DB
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (params.gettoken) {
                        // Generar y devolver token
                        return res.status(200).send({ token: jwt.createToken(user) });
                    } else {
                        // user.password permite no devolver la contraseña por post
                        user.password = undefined;
                        // devolver datos de usuario
                        return res.status(200).send({ user })
                    }
                } else {
                    return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
                }
            });
        } else {
            return res.status(404).send({ message: 'El usuario no se ha podido encontrar' });
        }
    });
}

// conseguir datos de un usuario
function getUser(req, res) {
    //recoger parametro que llega por la url
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!user) return res.status(404).send({ message: 'El usuario no existe' });

        return res.status(200).send({ user });
    });
}

//devolver listado de usuarios paginado con mongoose-pagination
function getUsers(req, res) {
    //recoger el id del usuario que este logueado en este momento
    var identity_user_id = req.user.sub;
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!users) return res.status(404).send({ message: 'No hay usuarios en la plataforma' });
        // numero de paginas totales que hay, dividiendo el total por los items por pagina
        return res.status(200).send({ users, total, pages: Math.ceil(total / itemsPerPage) });
    });
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers
}