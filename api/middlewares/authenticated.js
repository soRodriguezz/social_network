'user strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso_desarrollar_red_social_angular';

exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cabecera de autenticacion' });
    }
    // reemplazar comillas simples y dobles con nada dentro del string que traiga el token
    var token = req.headers.authorization.replace(/['"]+/g, '');

    //capturar alguna excepcion
    try {
        //decodificar payload que tiene todos los objetos...email, nombre, etc
        var payload = jwt.decode(token, secret);
        //si lleva una fecha menor a la fecha de ahora el token se muestra como expirado
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: "El token ha expirado" });
        }
    } catch (ex) {
        return res.status(404).send({ message: 'Token no valido' });
    }
    //adjuntar payload al req, para tener dentro de los contenedores el usuario logueado 
    req.user = payload;
    // saltar a lo siguiente que tiene que ejecutar node
    next();
}