var hubIP = '',
	devicesMac = ''

api
	.use({
		server: hubIP,
		hub: ''
	})
	.notify(true)
	.on('notify', dataHandle)
	.on('conn', writeSpecialValue)
	.conn({
		node: devicesMac,
		type: 'public'
	})

var writeSpecialValue = function(e, args) {
	api.write({
		node: devicesMac,
		handle: 57,
		value: '01'
	})
	api.write({
		node: devicesMac,
		handle: 59,
		value: '64000000'
	})
	api.write({
		node: devicesMac,
		handle: 65,
		value: '01'
	})
}
var dataHandle = function(hub, data) {


	var dataParse = function(str) {
		var splitString = function(str, byte1, byte2) {
			function sum(arr, index) {
				var _arr = arr.slice(0, index)
				if (_arr.length !== 0) {
					return _arr.reduce(function(prev, cur, index, arr) {
						return prev + cur
					})
				}
				return 0
			}
			var temp = [],
				byteArr = Array.prototype.slice.call(arguments, 1),
				length = byteArr.length
			byteArr = byteArr.map(function(item) {
				return item * 2
			})
			for (var i = 0; i < length; i++) {
				temp.push(parseInt(str.substr(sum(byteArr, i), byteArr[i]), 16))
			}
			return temp
		}



		var _data = null,
			hiData = [],
			lowData1 = [],
			lowData2 = [],
			acc = [],
			gyro = [],
			light = [],
			noise = [],
			pressure = [],
			temperature = [],
			hum = [],
			sdCard = [],
			buttonStatus = [],
			magnetometer = [],
			magnetometerR = [],
			ledStatus = [],
			temp = str.substr(0, 2)


		if (temp === '01') {
			lowData1.push(str.substring(2))
			lowData1.forEach(function(item, index) {
				var temp = splitString(item, 4, 1, 4, 4, 4, 1, 1)
				light.push(temp[0])
				noise.push(temp[1])
				pressure.push(temp[2])
				temperature.push(temp[3])
				hum.push(temp[4])
				sdCard.push(temp[5])
				buttonStatus.push(temp[6])
			})
			return {
				time: new Date().getTime(),
				type: 'en',
				light: light[0],
				noise: noise[0],
				pressure: pressure[0],
				hum: hum[0]
			}

		}
		if (temp === '02') {
			lowData2.push(str.substring(2))
			lowData2.forEach(function(item, index) {
				var temp = splitString(item, 2, 2, 2, 2, 1)
				magnetometer.push({
					x: temp[0],
					y: temp[1],
					z: temp[2]
				})
				magnetometerR.push(temp[3])
				ledStatus.push(temp[4])
			})
			return {
				time: new Date().getTime(),
				type: 'ma',
				ma: [magnetometer[0].x, magnetometer[0].y, magnetometer[0].z]
				mar: magnetometerR[0]
			}
		}

		hiData.push(str)
		hiData.forEach(function(item, index) {
			acc.push({
				x: parseInt(item.substr(0, 4), 16),
				y: parseInt(item.substr(4, 4), 16),
				z: parseInt(item.substr(8, 4), 16)
			})
			gyro.push({
				x: parseInt(item.substr(12, 4), 16),
				y: parseInt(item.substr(16, 4), 16),
				z: parseInt(item.substr(20, 4), 16)
			})
		})
		return {
			time: new Date().getTime(),
			type: 'ag',
			acc: [acc[0].x, acc[0].y, acc[0].z]
			mar: magnetometerR[0]
		}
	}
	if (data !== ':keep-alive') {
		_data = JSON.parse(data)
		dataParse(_data)
	}
}