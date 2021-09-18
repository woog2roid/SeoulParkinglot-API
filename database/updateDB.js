const axios = require('axios');
const fs = require('fs');
require("dotenv").config({ path: "../.env" });

const currentTime = new Date();

const updateDB = async () => {
	try {
		//data 받아오기 (1000개 단위로 끊어서)
		let cnt = 0, data = `{"DATA" :`;
		while(true) {
			const response = await axios.get(
				`http://openapi.seoul.go.kr:8088/${process.env.SEOUL_API_KEY}/json/GetParkInfo/${cnt * 1000 + 1}/${(cnt + 1) * 1000}/`
			);
			if (response.data.GetParkInfo !== undefined) {
				let tmpString = JSON.stringify(response.data.GetParkInfo.row);
				
				//JSON 형식으로 바꾸기 위함
				if(cnt == 0) tmpString = tmpString.substring(0, tmpString.length - 1);
				else tmpString = tmpString.substring(1, tmpString.length - 1);
				tmpString += ",";
				
				data += tmpString;
				cnt++;
			}
			else if (cnt >= 14) {
				//seoul api가 5분마다 업데이트 되는 과정에서 불안정함...
				break;
			}
		}
		data = data.substring(0, data.length - 1);
		data += "]}";
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