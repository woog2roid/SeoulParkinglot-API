const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
	console.log(`${req.httpVersion} ${req.method} ${req.url}`);
	console.log(req.query);
	//alwaysfree, nightfree, satfree, holidayfree, lat, lng
	
	fs.readFile('./database/DB.json', 'utf8', (error, json) => {
		if (error) return console.log(error);
		
		const data = JSON.parse(json);
		
		/*
		let i = 0;
		while(data["DATA"][i] !== undefined) {
			  //i = i +1;
			  getDistance(lat, lng, data["DATA"][i].~~, data["DATA"][i].~~)
		}
		*/

		res.end(JSON.stringify(data, null, ' '));
	});
});

module.exports = router;