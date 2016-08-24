'use strict';

var path = process.cwd();
var SearchApi = require(path + '/app/controllers/searchApi.server.js');
require('dotenv').load();

module.exports = function (app) {

	var searchApi = new SearchApi();

	app.route('/')
		.get(function(req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/query/*')
		.get(searchApi.query);

	app.route('/history')
		.get(searchApi.getQueryHistory);
};