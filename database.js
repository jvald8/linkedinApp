'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var User;

mongoose.connect('mongodb://localhost:linkedinapp');

var userSchema = new Schema({
  name: String,
  email: String
})

User = mongoose.model('User', userSchema);
