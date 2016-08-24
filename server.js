'use strict';

var express = require('express'),
	routes = require('./app/routes/index.js'),
	mongoose = require('mongoose');

var app = express();

var uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/queries';
mongoose.connect(uri);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

routes(app);

var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log('Node.js listening on port ' + port + '...');
});