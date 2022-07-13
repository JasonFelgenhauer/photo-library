const Album = require('../models/Album');

const albums = async (req, res) => {
	const albums = await Album.find();
	res.render('albums', { title: 'My albums', albums });
};

const createAlbumForm = (req, res) => {
	res.render('new-album', {
		title: 'Create Album',
		errors: req.flash('error'),
	});
};

const createAlbum = async (req, res) => {
	try {
		await Album.create({
			title: req.body.album_title,
		});
		res.redirect('/albums');
	} catch (error) {
		req.flash('error', 'Error when creating album');
		res.redirect('/albums/create');
	}
};

module.exports = {
	albums,
	createAlbumForm,
	createAlbum,
};
