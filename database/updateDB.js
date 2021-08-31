const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const currentTime = new Date();

const updateDB = async () => {
	try {
		//총 주차장 갯수 확인
		const responseCount = await axios.get(
			`http://openapi.seoul.go.kr:8088/${process.env.SEOUL_API_KEY}/json/GetParkInfo/1/2/`
		);
		if (responseCount.data.GetParkInfo.RESULT.CODE !== 'INFO-000') {
			console.log(`${currentTime}에 서울 공영주차장 API 오류 발생`);
			return;
		}
		const totalCount = responseCount.data.GetParkInfo.list_total_count;

		//확인된 주차장 갯수로 1000개씩 잘라서 받아오기
		let cnt, response, data="";
		for (cnt = 0; cnt < totalCount / 1000; cnt++) {
			response = await axios.get(
				`http://openapi.seoul.go.kr:8088/${process.env.SEOUL_API_KEY}/json/GetParkInfo/${cnt * 1000 + 1}/${(cnt + 1) * 1000}/`
			);
			if(response.data.GetParkInfo !== undefined)
				data += JSON.stringify(response.data.GetParkInfo.row);
		}
		response = await axios.get(
			`http://openapi.seoul.go.kr:8088/${process.env.SEOUL_API_KEY}/json/GetParkInfo/${cnt * 1000 + 1}/${totalCount}`
		);
		if(response.data.GetParkInfo !== undefined)
			data += JSON.stringify(response.data.GetParkInfo.row);

		//.json 파일로 생성하기
		fs.writeFile('DB.json', data, 'utf-8', (e) => {
			if (e) {
				console.log(e);
			} else {
				console.log(`${currentTime}에 업데이트 성공적으로 진행함`);
			}
		});
	} catch (e) {
		console.log(e);
	}
};

updateDB();