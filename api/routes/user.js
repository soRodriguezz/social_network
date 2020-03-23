'use strict'

var express = require('express');
var UserController = require('../controllers/user');
//carga de middleware
var md_auth = require('../middlerwares/authenticated');

// tener accesso a los metodos delete, put, post, etc
var api = express.Router();

api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api;