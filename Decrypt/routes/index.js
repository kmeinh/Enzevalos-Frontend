var express = require('express');
var router = express.Router();

var openpgp = require('openpgp');
openpgp.initWorker({ path:'openpgp.worker.js' })
openpgp.config.aead_protect = true

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/decrypt', function(req, res, next) {
	options = {
	    message: openpgp.message.fromText("ww0EBwMI5k5a/S+uE0TX0nkBiZQdBMn3FyCpyHXaxe2shGAMiqAqXUClMhET1tq9ItgBv3XoGM+5zX/3q7mkJt7QUBmgbSHYZxBltjWg8sMqDBNvvwqvzQ6JJgtPa/NZ1fdsiU3OSerzwyGIMC++I8Km37lsMmJOLX1RVflc+al8rY1EDqjk4lnC"),
	    password: '9198-4099'
	};

	openpgp.decrypt(options).then(function(plaintext) {
	    return res.send(plaintext.data)
	})
});

module.exports = router;
