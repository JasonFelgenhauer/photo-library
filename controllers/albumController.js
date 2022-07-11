const Album = require('../models/Album');

const createAlbumForm = (req, res) => {
	res.render('new-album', { title: 'Create Album' });
};

const createAlbum = async (req, res) => {
	await Album.create({
		title: req.body.album_title,
	});

	res.redirect('/');
};

module.exports = {
	createAlbumForm,
	createAlbum,
};
