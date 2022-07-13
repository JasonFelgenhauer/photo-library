const Album = require('../models/Album');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const album = async (req, res) => {
	try {
		const album = await Album.findById(req.params.id);
		res.render('album', { title: 'Album', album, errors: req.flash('error') });
	} catch (error) {
		res.redirect('/404');
	}
};

const addImage = async (req, res) => {
	const album = await Album.findById(req.params.id);

	if (!req?.files?.add_image) {
		req.flash('error', 'No image selected');
		res.redirect(`/albums/id/${album._id}`);
		return;
	}

	if (req.files.add_image.mimetype != 'image/jpeg' && req.files.add_image.mimetype != 'image/png') {
		req.flash('error', 'Image must be jpeg or png');
		res.redirect(`/albums/id/${album._id}`);
		return;
	}

	const folderPath = path.join(__dirname, '../public/uploads/albums/' + req.params.id);

	fs.mkdirSync(folderPath, { recursive: true });

	const localPath = path.join(folderPath, req.files.add_image.name);
	await req.files.add_image.mv(localPath);

	album.images.push(req.files.add_image.name);
	await album.save();

	res.redirect(`/albums/id/${album._id}`);
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

const deleteImage = async (req, res) => {
	const album = await Album.findById(req.params.id);
	const image = album.images[req.params.index];
	if (!image) {
		res.redirect('/albums/id/' + req.params.id);
		return;
	}

	album.images.splice(req.params.index, 1);
	await album.save();

	const imagePath = path.join(__dirname, '../public/uploads/albums/' + req.params.id + '/' + image);
	fs.unlinkSync(imagePath);

	res.redirect('/albums/id/' + req.params.id);
};

const deleteAlbum = async (req, res) => {
	await Album.findByIdAndDelete(req.params.id);

	const albumPath = path.join(__dirname, '../public/uploads/albums/' + req.params.id);

	rimraf(albumPath, () => {
		res.redirect('/albums');
	});
};

module.exports = {
	albums,
	album,
	addImage,
	createAlbumForm,
	createAlbum,
	deleteImage,
	deleteAlbum,
};
