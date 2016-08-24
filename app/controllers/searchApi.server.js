'use strict';

var https = require('https');
var Queries = require('../models/query.js');


function searchApi () {

	this.query = function(req, res) {
		var results = '';


		// get parameters

		var key = process.env.GOOGLE_CSE_KEY;
		var cx = '017556536032254322800:rs5ki6hgnhg';
		var q = encodeURIComponent(req.query.q) || 'testing';
		var offset = req.query.offset || null;


		// build https query

		var params = 'searchType=image&fields=items(link,snippet,image(contextLink,thumbnailLink))&imgSize=medium&num=10&imgsize=medium'+'&key='+key+'&cx='+cx+'&q='+q;
		if (offset != null) params += '&start='+offset;
		var options = {
			host: 'www.googleapis.com',
			path: '/customsearch/v1?' + params
		}


		// execute query

		https.get(options, function(response) {
			response.on('data', function(chunk) {
				results += chunk;
			}).on('error', function(err) {
				console.error(err);
				res.send(err);
			}).on('end', function() {
				var formatted = [];

				
				// For each successful query, format the results to
				// the desired response schema
				
				JSON.parse(results).items.forEach(function(item) {
					formatted.push({
						url: item.link,
						snippet: item.snippet,
						thumbnail: item.image.thumbnailLink,
						context: item.image.contextLink
					});
				})


				// For each successful query, create a MongoDB entry
				// so that recent search history may be queried

				var newQuery = new Queries({
					term: q
				})

				newQuery.save(function(err, doc) {
					if (err) throw err;
				})


				// return formatted query results to browser
				
				res.send(formatted);
			});
		});
	}

	this.getQueryHistory = function(req, res) {
		var lastTenQueries = [];
		
		// Get 10 most recent queries, excluding _id field
		var queries = Queries.find({}, '-_id term when')
			.sort('-when')
			.limit(10)
			.exec(function(err, docs) {
				res.send(docs);
		});
	}
}

module.exports = searchApi;