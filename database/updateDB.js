const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const currentTime = new Date();

const updateDB = async () => {
	try {
		//data 받아오기 (1000개 단위로 끊어서)
		let cnt = 0, data = "";
		while(true) {
			const response = await axios.get(
				`http://openapi.seoul.go.kr:8088/${process.env.SEOUL_API_KEY}/json/GetParkInfo/${cnt * 1000 + 1}/${(cnt + 1) * 1000}/`
			);
			if (response.data.GetParkInfo !== undefined) {
				data += JSON.stringify(response.data.GetParkInfo.row);
				cnt++;
			}
			else if (cnt >= 14) {
				//seoul api가 5분마다 업데이트 되는 과정에서 불안정함...
				//최소 14000개 이상이므로 강제로 조건 추가
				break;
			}
		}
		//.json 파일로 생성하기
		fs.writeFile('DB.json', data, 'utf-8', (e) => {
			if (e) {
				console.log(e);
			} else {
				console.log(`${currentTime}에 DB.JSON 업데이트 성공적으로 진행함`);
			}
		});
	} catch (e) {
		console.log(e);
	}
};

updateDB();