const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const path = require('path');
const mongoose = require('mongoose');
const albumRoutes = require('./routes/albumRoutes');

const app = express();
const port = 3000;

mongoose.connect('');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.use(
	session({
		secret: 'pS"ZfFkYj/*ZI9z/slS.7A25<-!gd;',
		resave: false,
		saveUninitialized: true,
	})
);
app.use(flash());

app.get('/', (req, res) => {
	res.redirect('/albums');
});

app.use('/', albumRoutes);
app.use((req, res, next) => res.status(404).send('Sorry cant find that!'));
app.use((err, req, res, next) => {
	res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
