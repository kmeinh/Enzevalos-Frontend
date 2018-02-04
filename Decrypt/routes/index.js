var express = require('express');
var router = express.Router();
var textEncoding = require('text-encoding'); 
var TextDecoder = textEncoding.TextDecoder;

var openpgp = require('openpgp');
openpgp.initWorker({ path:'openpgp.worker.js' })
openpgp.config.aead_protect = true

router.get('/', function(req, res, next) {

	var query = req.query

	if (!query.text || !query.cipher) {

		res.redirect("http://userpage.fu-berlin.de/wieseoli/letterbox/");
  		return
	}

	let texts = query.text.split(',')
	
	res.render('index', {title: 'Entschlüsseln', texts: texts, cipher: query.cipher, stored_texts: texts.join(',')})
});

router.post('/decrypt', function(req, res) {

	console.log(req.body)

	var options = {
	    message: openpgp.message.readArmored(req.body.cipher),
	    password: req.body.password.trim()
	};

	openpgp.decrypt(options)
		.then(function(plaintext) {

	    	res.render('decrypt', { 
  				title: 'Klartext',
  				texts: plaintext.data.split('\n')
  			});
		})
		.catch(function(reason) {
			
			res.render('index', {title: 'Entschlüsseln', texts: req.body.texts.split(','), cipher: req.body.cipher, password: req.body.password, isInvalid: "is-invalid"})
		})
});

module.exports = router;
