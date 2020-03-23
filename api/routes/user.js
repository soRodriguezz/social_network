'use strict'

var express = require('express');
var UserController = require('../controllers/user');


var multipart = require('connect-multiparty');

// tener accesso a los metodos delete, put, post, etc
var api = express.Router();
var md_upload = multipart({ uploadDir: './uploads/users'});
//carga de middleware
var md_auth = require('../middlerwares/authenticated');

api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);

module.exports = api;