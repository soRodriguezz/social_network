'use strict'

const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

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

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser
}