const Album = require('../models/Album');
const catchAsync = require('../helpers/catchAsync');
const path = require('path');
const { mkdirSync, unlinkSync } = require('fs');
const rimraf = require('rimraf');

const album = catchAsync(async (req, res) => {
	const id = req.params.id;
	const album = await Album.findById(id);
	if (!album) return res.redirect('/albums');

	res.render('album', { title: 'Album', album, errors: req.flash('error') });
});

const addImage = catchAsync(async (req, res) => {
	const id = req.params.id;
	const album = await Album.findById(id);
	if (!album) return res.redirect('/albums');

	if (!req?.files?.add_image) {
		req.flash('error', 'No image selected');
		return res.redirect(`/albums/id/${album._id}`);
	}

	if (req.files.add_image.mimetype != 'image/jpeg' && req.files.add_image.mimetype != 'image/png' && req.files.add_image.mimetype != 'image/gif') {
		req.flash('error', 'Wrong image format');
		return res.redirect(`/albums/id/${id}`);
	}

	const folderPath = path.join(__dirname, '../public/uploads/albums/' + id);
	mkdirSync(folderPath, { recursive: true });

	const localPath = path.join(folderPath, req.files.add_image.name);
	await req.files.add_image.mv(localPath);

	album.images.push(req.files.add_image.name);
	await album.save();

	res.redirect(`/albums/${id}`);
});

const albums = catchAsync(async (req, res) => {
	const albums = await Album.find();
	res.render('albums', { title: 'My albums', albums });
});

const createAlbumForm = catchAsync(async (req, res) => {
	res.render('new-album', { title: 'Create Album', errors: req.flash('error') });
});

const createAlbum = catchAsync(async (req, res) => {
	const title = req.body.album_title;
	if (!title) {
		req.flash('error', 'No title provided');
		return res.redirect('/albums/create');
	}
	if (title.length > 20) {
		req.flash('error', 'Title is too long');
		return res.redirect('/albums/create');
	}

	const album = await Album.create({
		title: title,
	});

	res.redirect('/albums');
});

const deleteImage = catchAsync(async (req, res) => {
	const id = req.params.id;
	const index = req.params.index;

	const album = await Album.findById(id);
	if (!album) return res.redirect('/albums');

	const image = album.images[index];
	if (!image) return res.redirect('/albums/' + id);

	album.images.splice(index, 1);
	await album.save();

	const imagePath = path.join(__dirname, `../public/uploads/albums/${id}/${image}`);
	unlinkSync(imagePath);

	res.redirect('/albums/' + id);
});

const deleteAlbum = catchAsync(async (req, res) => {
	const id = req.params.id;
	await Album.findByIdAndDelete(id);

	const albumPath = path.join(__dirname, '../public/uploads/albums/' + id);
	rimraf(albumPath, () => {
		res.redirect('/albums');
	});
});

module.exports = {
	albums,
	album,
	addImage,
	createAlbumForm,
	createAlbum,
	deleteImage,
	deleteAlbum,
};
