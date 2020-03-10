'use strict'
// cargar modulos de la libreria de jwt
var jwt = require('jwt-simple');
// libreria moment para generar fechas
var moment = require('moment');
//clave secreta como desarrollador para generar token
var secret = 'clave_secreta_curso_desarrollar_red_social_angular';

// funcion para crear un metodo
exports.createToken = function(user) {
    // tiene datos del usuario que quiero codificar dentro del token
    var payload = {
            sub: user._id,
            name: user.name,
            surname: user.surname,
            nick: user.nick,
            email: user.email,
            role: user.role,
            image: user.image,
            // fecha de creacion del token
            iat: moment().unix(),
            // fecha expiracion agregando 30 dias
            exp: moment().add(30, 'days').unix
        }
        // a jwt se le pasan los datos del objeto y la clave secreta, encode lo hashea y creo un codigo enciptado
    return jwt.encode(payload, secret);

};

//hola mundo