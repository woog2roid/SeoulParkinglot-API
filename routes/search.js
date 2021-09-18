const express = require('express');
const fs = require('fs');

const router = express.Router();
const { getDistance } = require('../utils/getDistance');

router.get('/', (req, res) => {
	console.log(`${req.httpVersion} ${req.method} ${req.url}`);
	console.log(req.query);
	//alwaysfree, nightfree, satfree, holidayfree: FORM condition
	//lat, lng, radius: DIST condition
	const lat = req.query.lat, lng = req.query.lng, radius = req.query.radius;
	const alwaysfree = req.query.alwaysfree, nightfree = req.query.nightfree,
		  satfree = req.query.satfree, holidayfree = req.query.holidayfree;
	
	fs.readFile('./database/DB.json', 'utf8', (error, json) => {
		if (error) return console.log(error);

		//json data
		const data = JSON.parse(json);

		//FORM 조건에 맞는지 확인.
		const filterByForm = data['DATA'].filter((element) => {
			let form = true;
			if(alwaysfree==="true") form = (form && element['pay_yn'] === 'N'); 
			if(nightfree==="true") form = (form && element['night_free_open'] === 'Y');
			if(satfree==="true") form = (form && element['saturday_pay_yn'] === 'N');
			if(holidayfree==="true") form = (form && element['holiday_pay_yn'] === 'N');
			
			return form;	
		});
		
		//DIST 조건에 맞는지 확인., lat, lng, radius
		const result = filterByForm.filter((element) => {
			return (getDistance(lat, lng, element['lat'], element['lng']) <= radius);
		});
		
		res.end(JSON.stringify(result, null, ' '));
		console.log("::FINISHED::");
	});
});

module.exports = router;