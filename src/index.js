const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');


dotenv.config();

const app = express();

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

app.use(express.urlencoded({ extended: false }));
//rutes
app.use(require('./routes/files'));
app.use(require('./routes/login'));

app.use(express.static(path.join(__dirname, 'public')));