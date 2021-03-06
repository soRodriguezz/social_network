'use strict'

// const path = require('path');
// const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');

const User = require('../models/user');
const Follow = require('../models/follow');

function saveFollow(req, res) {
    const params = req.body;
    const follow = new Follow();

    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if(err) return res.status(500).send({ message: 'Error al guardar el seguimiento'});
        if(!followStored) return res.status(404).send({ message: 'El seguimiento no se ha guardado' });
        return res.status(200).send({ follow: followStored });
    });
}

function deleteFollow(req, res) {
    const userId = req.user.sub;
    const followId = req.params.id;

    Follow.find({ 'user': userId, 'followed': followId }).remove(err => {
        if(err) return res.status(500).send({ message: 'Error al dejar de seguir' });
        return res.status(200).send({ message: 'El follow se ha eliminado' });
    });
}

module.exports = {
    saveFollow,
    deleteFollow
}