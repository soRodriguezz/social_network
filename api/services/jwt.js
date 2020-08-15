'use strict'
const jwt = require('jwt-simple');
const moment = require('moment');

var secret = 'password123-123-123-321'

exports.createToken = function(user){
    const payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        //fecha de creacion de jwt
        iat: moment().unix(),
        //fecha de expiracion token
        exp: moment().add(30, 'days').unix
    };
    // Genera el token con todos los datos del user y codifica entregando un hash
    return jwt.encode(payload, secret);
};