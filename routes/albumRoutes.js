const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');

router.get('/albums', albumController.albums);

router.get('/albums/:id', albumController.album);

router.get('/albums/create', albumController.createAlbumForm);

router.post('/albums/create', albumController.createAlbum);

module.exports = router;
