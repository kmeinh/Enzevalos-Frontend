var express = require('express');
var router = express.Router();
var textEncoding = require('text-encoding'); 
var TextDecoder = textEncoding.TextDecoder;

var openpgp = require('openpgp');
openpgp.initWorker({ path:'openpgp.worker.js' })
openpgp.config.aead_protect = true

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/decrypt', function(req, res, next) {

	var options = {
	    message: openpgp.message.readArmored("-----BEGIN PGP MESSAGE-----\nVersion: ObjectivePGP\nComment: https://www.objectivepgp.com\nCharset: UTF-8\n\nww0EBwMIX4I1A0XO3KzX0nAB7/yDorOPhkRpwgEe7H6m3l0DJr0Gh3ikNGzTqKXucSSDQ+DRy1wH\nYhJJXb7U9aXejUVVupZvgJFJ9C8I5/P3j5oe1KFqW5ZzokWvz2NWF8v/GzVdiZ2wRvG/EX0yXlRh\n/Vz2cTjpC4mN5wRAPb2B\n=mZbf\n-----END PGP MESSAGE-----"),
	    password: '6125-4985'
	};

	console.log(new TextDecoder("ascii").decode(options.message.packets.write()))
	openpgp.decrypt(options).then(function(plaintext) {
		console.log(plaintext)
	    res.send(plaintext.data)
	})
});

router.get('/encrypt', function(req, res, next) {
	var options, encrypted;

	options = {
	    data: "Kontonummer",
	    passwords: '9198-4099',
	    armor: false
	};
	
	openpgp.encrypt(options).then(function(ciphertext) {
		console.log(new TextDecoder("utf-8").decode(ciphertext.message.packets.write()));
		var array = ciphertext.message.packets.write();

		options = {
	    	message: openpgp.message.read(array),
	    	password: '9198-4099'
		};

		openpgp.decrypt(options).then(function(plaintext) {
			console.log(plaintext)
	  		res.send(plaintext.data)
		})
	});
});

module.exports = router;
