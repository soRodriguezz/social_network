'use strict'

var express = require('express');
var UserController = require('../controllers/user');

// tener accesso a los metodos delete, put, post, etc
var api = express.Router();

api.get('/home', UserController.home);
api.get('/pruebas', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api;