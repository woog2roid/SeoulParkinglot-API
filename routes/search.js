const express = require('express');
const fs = require('fs');

const router = express.Router();
const { getDistance } = require('../utils/getDistance');

router.get('/', (req, res) => {
	console.log(`${req.httpVersion} ${req.method} ${req.url}`);
	console.log(req.query);
	//free, nightfree, satfree, holidayfree: FORM CONDITION
	//lat, lng, radius: DIST CONDITION
	const lat = req.query.lat, lng = req.query.lng, radius = req.query.radius;
	const free = req.query.free, nightfree = req.query.nightfree,
		  satfree = req.query.satfree, holidayfree = req.query.holidayfree;
	
	fs.readFile('./database/DB.json', 'utf8', (error, json) => {
		if (error) return console.log(error);

		//json data
		const data = JSON.parse(json);
		
		/*조건에 맞는 것들만 필터링*/
		const filteredData = data['DATA'].filter((element) => {
			let form = true;
			if(free==="true") form = (form && element['PAY_YN'] === 'N'); 
			if(nightfree==="true") form = (form && element['NIGHT_FREE_OPEN'] === 'Y');
			if(satfree==="true") form = (form && element['SATURDAY_PAY_YN'] === 'N');
			if(holidayfree==="true") form = (form && element['HOLIDAY_PAY_YN'] === 'N');
			
			let dist = (getDistance(lat, lng, element['LAT'], element['LNG']) <= radius);
			return form && dist;
		});
		
		/*중복되는 것들은 LATLNG배열로 만들고 하나로 묶기*/
		let result = [];
		for(let i=0; i<filteredData.length; i=i+1) {
			let isUnique = true;
			for(let j=0; j<result.length; j=j+1) {
				//동일한 이름이 있다면, lat, lng만 받아서 LatLng배열에 추가시킬것
				if(filteredData[i].PARKING_NAME === result[j].PARKING_NAME) {
					isUnique = false;
					result[j].LAT.push(filteredData[i].LAT);
					result[j].LNG.push(filteredData[i].LNG);
					break;
				}
			}
			//동일한 이름이 없다면, result에 추가해줄 것.
			if(isUnique) {
				const lat=filteredData[i].LAT, lng=filteredData[i].LNG;
				filteredData[i].LAT = [lat, ], filteredData[i].LNG = [lng, ];
				result.push(filteredData[i]);
			}
		}
		
		res.end(JSON.stringify(result, null, ' '));
		console.log("::FINISHED::");
	});
});

module.exports = router;