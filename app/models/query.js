'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Query = new Schema(
{
	'term': {type: String, required: true },
	'when': {type: Date, default: Date.now }
}, {
	versionKey: false,
	_id: false
});

module.exports = mongoose.model('Query', Query);