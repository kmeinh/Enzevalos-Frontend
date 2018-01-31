var express = require('express');
var router = express.Router();
var textEncoding = require('text-encoding'); 
var TextDecoder = textEncoding.TextDecoder;

var openpgp = require('openpgp');
openpgp.initWorker({ path:'openpgp.worker.js' })
openpgp.config.aead_protect = true

/* GET home page. */
router.get('/', function(req, res, next) {

	var query = req.query

	if (!query.text) {
		res.render('parameterless', { 
  			title: 'Enzevalos',
  			messageTitle: 'Seite nicht gefunden',
  			additional: 'Versuche es nocheinmal mit dem Link aus der E-Mail'
  		});

  		return
	}

	let texts = query.text.split(',')
	
	res.render('index', {title: 'Entschlüsseln', texts: texts})
});

router.get('/decrypt', function(req, res, next) {

	//-----BEGIN PGP MESSAGE-----\n\nww0EBwMIT2tdgUK9LBfX0kEBrzkG4ELPGzfGVoNsD4l8W7X4IORgud5tkalTpVrL+hq7fKdwt53i\nyD2fmQjDt45JSAOKOBftAR6EmRCvuB048g==\n=ak/6\n-----END PGP MESSAGE-----\n
	// 7505-3824

	//ww0EBwMIZoDGErw5YU7X0kEBrk+dC7fFAgy2SyBa7tA9cw++khbA1FtzBsCLuyidc2LBJ/2fqqV7ak1kwBNpTv5AuYvAXgWv29EYw+pNwS5dGw==
	//0661-4928

	var message = openpgp.message.fromText("ww0EBwMIZoDGErw5YU7X0kEBrk+dC7fFAgy2SyBa7tA9cw++khbA1FtzBsCLuyidc2LBJ/2fqqV7ak1kwBNpTv5AuYvAXgWv29EYw+pNwS5dGw==")
	var armor = message.armor()
	console.log(armor)

	var options = {
	    message: openpgp.message.readArmored(armor),
	    password: '0661-4928'
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
