'user strict'
const jwt = require('jwt-simple');
const moment = require('moment');

var secret = 'password123-123-123-321'

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({ message: 'La peticion no tiene cabecera de autenticacion' });
    }
    // Borra las comillas simples y dobles de cualquier parte del string
    const token = req.headers.authorization.replace(/['"]+/g, '');
    // le paso lo que pongan en la cabecera y la clave secreta
    try{
        //desencriptar payload (token)
        var payload = jwt.decode(token, secret);
        //validar si el payload vencio
        if(payload <= moment().unix()){
            return res.status(401).send({ message: 'El token ha expirado' });
        }
    } catch(ex) {
        return res.status(404).send({ message: 'El token no es valido' });
    }
    req.user = payload;
    // permite seguir con la ejecucion del controlador
    next();
}