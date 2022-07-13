const Album = require('../models/Album');

const album = async (req, res) => {
	try {
		const id = req.params.id;
		const album = await Album.findById(id);
		res.render('album', { title: 'Album', album });
	} catch (error) {
		res.redirect('/404');
	}
};

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
	album,
	createAlbumForm,
	createAlbum,
};
