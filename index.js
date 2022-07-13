const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const albumRoutes = require('./routes/albumRoutes');

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://mr__wigy:ill4aqomrLfJYXsE@cluster0.3uufg.mongodb.net/?retryWrites=true&w=majority');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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

app.listen(port, () => console.log(`App listening on port ${port}!`));
