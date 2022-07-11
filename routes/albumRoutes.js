const express = require('express');
const router = express.Router();

router.get('/albums/create', (req, res) => {
	res.render('new-album', { title: 'Create Album' });
});

module.exports = router;
