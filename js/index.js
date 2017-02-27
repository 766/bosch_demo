'use strict'
Zepto(function ($) {

	let deviceDataInit = {
			accxData: [],
			accyData: [],
			acczData: [],
			accDate: [],
			gyroxData: [],
			gyroyData: [],
			gyrozData: [],
			gyroDate: [],
			lightData: [],
			lightDate: [],
			noiseData: [],
			noiseDate: [],
			temperatureData: [],
			temperatureDate: [],
			humData: [],
			humDate: [],
			pressureData: [],
			pressureDate: [],
			magneticDate: [],
			magneticxData: [],
			magneticyData: [],
			magneticzData: [],
			magnetometerRData: []
		},
		connectNum = 0

	let device = {
		fre1: '64000000',
		fre2: '100',
		temp: {},
		newItem: false
	}
	$('#frequency').on('change', function () {
		$('#frequencyData').html(this.value)
		let fre = Math.floor(1000 / this.value).toString(16)
		device.fre1 = lsbToMsb(fre, 4)
		// console.log(device.fre1)

	})
	$('#refresh').on('change', function () {
		$('#refreshData').html(this.value)
		device.fre2 = Math.floor(1000 / this.value)
		// console.log(device.fre2)

	})
	let lsbToMsb = function (string, totalbyte) {
		let length = string.length,
			_string = string,
			n = 1,
			str = _string
		if (length % 2) {
			_string = '0' + _string
			length++
		}
		if (parseInt(_string, 16) > 256) {
			str = ''
			while (length - 2 * n >= 0) {
				str += _string.substr(length - 2 * n, 2)
				n++
			}
		}
		while (str.length < totalbyte * 2) {
			str = str + '00'
		}
		return str
	}

	let chartInit = function (n, mac) {
		let _mac = mac || 'temp',
			_n = n - 1
		device[_mac].accChart = echarts.init($('.acc')[_n])
		device[_mac].gyroChart = echarts.init($('.gyro')[_n])
		device[_mac].lightChart = echarts.init($('.light')[_n])
		device[_mac].noiseChart = echarts.init($('.noise')[_n])
		device[_mac].temperatureChart = echarts.init($('.temperature')[_n])
		device[_mac].humChart = echarts.init($('.hum')[_n])
		device[_mac].pressureChart = echarts.init($('.pressure')[_n])
		device[_mac].magneticChart = echarts.init($('.magnetic')[_n]);
		(function () {
			let tooltip = {
				trigger: 'axis',
				// formatter: function (params) {
				//     params = params[0];
				//     let date = new Date(params.name);
				//     return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</br>' ;
				// },
			};

			let grid = {
				left: '3%',
				right: '0%',
				bottom: '3%',
				containLabel: true
			};

			let xAxis = {
				nameLocation: 'middle',
				name: 'time',
				type: 'category',
				boundaryGap: false,
				data: []
			};

			device[_mac].accChart.setOption({
				title: {
					text: '加速度'
				},
				tooltip: {
					trigger: 'axis',
				},
				legend: {
					data: ['x', 'y', 'z']
				},
				xAxis: xAxis,
				yAxis: {
					name: 'm/s²'
				},
				grid: grid,
				series: [{
					name: 'x',
					type: 'line',
					sampling: 'average'
				}, {
					name: 'y',
					type: 'line',
					sampling: 'average',
				}, {
					name: 'z',
					type: 'line',
					sampling: 'average',
				}]
			});

			device[_mac].gyroChart.setOption({
				title: {
					text: '陀螺仪'
				},
				tooltip: tooltip,
				xAxis: xAxis,
				yAxis: {
					name: 'm/s²'
				},
				grid: grid,
				series: [{
					name: 'x',
					type: 'line',
					sampling: 'average',
				}, {
					name: 'y',
					type: 'line',
					sampling: 'average',
				}, {
					name: 'z',
					type: 'line',
					sampling: 'average',
				}]
			});

			device[_mac].lightChart.setOption({
				title: {
					text: '光照'
				},
				tooltip: tooltip,
				xAxis: xAxis,
				yAxis: {
					name: 'lux'
				},
				grid: grid,
				series: [{
					name: '光照',
					type: 'line',
					sampling: 'average'
				}]
			});
			device[_mac].noiseChart.setOption({
				title: {
					text: '声感'
				},
				tooltip: tooltip,
				xAxis: xAxis,
				yAxis: {
					name: 'dB'
				},
				grid: grid,
				series: [{
					name: '声感',
					type: 'line',
					sampling: 'average'
				}]
			});
			device[_mac].temperatureChart.setOption({
				title: {
					text: '温度'
				},
				tooltip: tooltip,
				xAxis: xAxis,
				yAxis: {
					name: '℃'
				},
				grid: grid,
				series: [{
					name: '温度',
					type: 'line',
					sampling: 'average'
				}]
			});
			device[_mac].humChart.setOption({
				title: {
					text: '湿度'
				},
				tooltip: tooltip,
				xAxis: xAxis,
				yAxis: {
					name: 'rh%'
				},
				grid: grid,
				series: [{
					name: '湿度',
					type: 'line',
					sampling: 'average'
				}]
			});
			device[_mac].pressureChart.setOption({
				title: {
					text: '压力'
				},
				tooltip: tooltip,
				xAxis: xAxis,
				yAxis: {
					name: 'kPa'
				},
				grid: grid,
				series: [{
					name: '压力',
					type: 'line',
					sampling: 'average'
				}]
			});
			device[_mac].magneticChart.setOption({
				title: {
					text: '磁感'
				},
				tooltip: tooltip,
				xAxis: xAxis,
				yAxis: {
					name: 'T'
				},
				grid: grid,
				series: [{
					name: 'x',
					type: 'line',
					sampling: 'average'
				}, {
					name: 'y',
					type: 'line',
					sampling: 'average'
				}, {
					name: 'z',
					type: 'line',
					sampling: 'average'
				}, {
					name: 'r',
					type: 'line',
					sampling: 'average'
				}]
			})
			_mac === 'temp' ? device[_mac].created = true : 0;
		})()
	}

	chartInit(1)



	let createChart = function (n, name, mac) {
		let chartHtmlStr = function () {
			return `<div class="chart clearfix" data-mac='${mac}'>
            <div class="message">
                <h2>XDK${n}&nbsp;</h2>
                <span class="name">${name}</span>
				<b>Mac:${mac}</b>
                <span class="hidden">状态:</span>
                <span class="status hidden">在线</span>
                <i>收到数据包:</i>
                <span class="packNum">0</span>个
				<time></time>
            </div>
            <div class="acc pic"></div>
            <div class="gyro pic"></div>
            <div class="light pic"></div>
            <div class="noise pic"></div>
            <div class="temperature pic"></div>
            <div class="hum pic"></div>
            <div class="pressure pic"></div>
            <div class="magnetic pic"></div>
        </div>`
		}

		let chartList = $('#graphic .chart')
		if (chartList[0].dataset.mac === '') {
			chartList[0].dataset.mac = mac
			$(chartList[0]).find('span')[0].innerHTML = name
			device[mac].created = true
		} else {
			$('#graphic').append(chartHtmlStr())
			chartInit(n, mac)
		}
	}



	let hubIP = '',
		devicesName = '',
		deviceNameInit = 'BCDS_Virtual_Sensor',
		reg_ip = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
		reg_mac = /\w+/i,
		dd, bosch = null

	if (localStorage.bosch) {
		bosch = JSON.parse(localStorage.bosch)
		if (reg_ip.test(bosch[0])) {
			$('#hub_ip').val(bosch[0])
			$('#device_name').val(bosch[1])
		}
	}

	function getIpMac() {
		hubIP = $('#hub_ip').val().trim()
		devicesName = $('#device_name').val().trim()
		if (!reg_ip.test(hubIP)) {
			alert('hubIP输入错误')
			return false
		}
		localStorage.setItem('bosch', JSON.stringify([hubIP, devicesName]))
		return true
	}

	let dataHandle = function (hub, data) {
		if (data !== 'keep-alive') {
			let _data = JSON.parse(data)
			dd = dataParse(_data.value, _data.id)
			notify(dd, _data.id)
		}
	}



	/**
	 * api {String }  
	 * args  {Array} [api.hub,event.data]
	 */

	let scanHandle = function (hub, args) {
		if (args !== 'keep-alive') {
			let data = JSON.parse(args),
				mac = data.bdaddrs[0].bdaddr,
				type = data.bdaddrs[0].bdaddrType
			if (data.name === devicesName || data.name === deviceNameInit) {
				if (!device[mac]) {
					device.newItem = true
					device[mac] = {
						name: data.name,
						type: type,
						connect: false,
						created: false,
						lastConnect: 1
					}
					if (connectNum === 0) {
						$.extend(true, device[data.bdaddrs[0].bdaddr], device.temp)
						delete device.temp
					}
				}
			}

		}
		if (device.newItem) {
			// device.newItem = false
			let newConnect = new Date().getTime()
			for (let i in device) {
				if (i.indexOf(':') > -1 && !device[i].connect) {
					let lastConnect = device[i].lastConnect

					if (lastConnect && (newConnect - lastConnect <= 3000))
						return
					device[i].lastConnect = newConnect
					console.log('正在连接', i)
					api.conn({
						node: i,
						type: device[i].type,
						success: function (hub, mac, data) {
							//防止连接多次 多次返回连接成功  多次执行本函数
							if (device[mac].connect)
								return
							device[mac].connect = true
							connectNum = connectedDeviceCount(device)
							if (connectNum === 1) {
								$('#graphic .message').eq(0).children('b').html(`Mac:${mac}`)
								$('#graphic .chart')[0].dataset.mac = i
								$('#graphic .name')[0].innerHTML = device[i].name
							} else {
								!device[mac].created && createChart(connectNum, device[i].name, mac)
							}

							$.extend(true, device[mac], deviceDataInit)
							device[mac].lastnotify = 0
							device[mac].mes = {
								mesCounts: 0,
								counts: $('.packNum')[connectNum - 1]
							}
							writeSpecialValue(mac)
							// debugger
						}
					})
				}
			}
		}
	}

	let connectedDeviceCount = function (device) {
		let n = 0;
		for (let i in device) {
			if (i.indexOf(':') > -1 && device[i].connect) {
				n++
			}
		}
		console.log('n', n)
		return n
	}



	$('#disconnect').on('click', function () {
		if (!getIpMac()) {
			return
		}
		api
			.use({
				server: hubIP,
				hub: ''
			})
			.disconn({
				node: devicesMac
			})
	})


	$('#connect').on('click', function () {
		//此接口用于连接设备
		if (!getIpMac()) {
			return
		}
		api
			.use({
				server: hubIP,
				hub: ''
			})
			.on('notify', dataHandle)
			.scan(0)
			.on('scan', scanHandle)
	})

	function fillData(dataArr, timeArr, data, time) {
		if (dataArr.length > 10 || timeArr.length > 10) {
			dataArr.shift()
			timeArr.shift()
		}
		dataArr.push(data)
		timeArr.push(time)
	}



	function notify(value, mac) {
		device[mac].mes.counts.innerHTML = ++device[mac].mes.mesCounts
		if (device[mac].lastnotify === 0) {
			let time = 0;
			setInterval(function () {
				time++
				// debugger
				$(`.chart[data-mac='${mac}']`).find('time')[0].innerHTML = `${time}s  ${(device[mac].mes.mesCounts/time).toFixed(2)}个/s`
				// $(`.chart[data-mac='${mac}']`).find('time')[0].innerHTML = time + 's'
			}, 1000)
		}
		if (new Date() - device[mac].lastnotify < device.fre2)
			return
		device[mac].lastnotify = new Date()
		let accxData = device[mac].accxData,
			accyData = device[mac].accyData,
			acczData = device[mac].acczData,
			accDate = device[mac].accDate,
			gyroxData = device[mac].gyroxData,
			gyroyData = device[mac].gyroyData,
			gyrozData = device[mac].gyrozData,
			gyroDate = device[mac].gyroDate,
			lightData = device[mac].lightData,
			lightDate = device[mac].lightDate,
			noiseData = device[mac].noiseData,
			noiseDate = device[mac].noiseDate,
			temperatureData = device[mac].temperatureData,
			temperatureDate = device[mac].temperatureDate,
			humData = device[mac].humData,
			humDate = device[mac].humDate,
			pressureData = device[mac].pressureData,
			pressureDate = device[mac].pressureDate,
			magneticDate = device[mac].magneticDate,
			magneticxData = device[mac].magneticxData,
			magneticyData = device[mac].magneticyData,
			magneticzData = device[mac].magneticzData,
			magnetometerRData = device[mac].magnetometerRData;
		//收到数据后调用这个接口通知我
		// debugger
		if (accDate.length >= 10) {
			accxData.shift();
			accyData.shift();
			acczData.shift();
			accDate.shift();
		}

		if (gyroDate.length >= 10) {
			gyroxData.shift();
			gyroyData.shift();
			gyrozData.shift();
			gyroDate.shift();
		}

		if (lightData.length >= 10) {
			lightData.shift();
			lightDate.shift();
			noiseData.shift();
			noiseDate.shift();
			temperatureData.shift();
			temperatureDate.shift();
			humData.shift();
			humDate.shift();
			pressureData.shift();
			pressureDate.shift();
		}

		if (magneticxData.length >= 10) {
			magnetometerRData.shift();
			magneticxData.shift();
			magneticyData.shift();
			magneticzData.shift();
			magneticDate.shift();
		}
		let date = new Date(value.time);
		let dateStr = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
		switch (value.type) {

			case 'ag':
				accDate.push(dateStr);
				accxData.push(value.acc[0])
				accyData.push(value.acc[1])
				acczData.push(value.acc[2])

				gyroDate.push(dateStr);
				gyroxData.push(value.gyro[0])
				gyroyData.push(value.gyro[1])
				gyrozData.push(value.gyro[2])

				break;
			case 'en':
				lightData.push(value.light);
				lightDate.push(dateStr);
				noiseData.push(value.noise);
				noiseDate.push(dateStr);
				temperatureData.push(value.temperature);
				temperatureDate.push(dateStr);
				humData.push(value.hum);
				humDate.push(dateStr);
				pressureData.push(value.pressure);
				pressureDate.push(dateStr);

				break;
			case 'ma':
				magneticDate.push(dateStr);
				magneticxData.push(value.ma[0])
				magneticyData.push(value.ma[1])
				magneticzData.push(value.ma[2])
				magnetometerRData.push(value.mar)

				break;
		}

		function refChart(type) {
			switch (type) {
				case 'ag':
					device[mac].accChart.setOption({
						xAxis: {
							data: accDate
						},
						series: [{
							data: accxData
						}, {
							data: accyData
						}, {
							data: acczData
						}]
					});
					device[mac].gyroChart.setOption({
						xAxis: {
							data: gyroDate
						},
						series: [{
							data: gyroxData
						}, {
							data: gyroyData
						}, {
							data: gyrozData
						}]
					});
					break;
				case 'en':
					device[mac].lightChart.setOption({
						xAxis: {
							data: lightDate
						},
						series: [{
							data: lightData
						}]
					});
					device[mac].noiseChart.setOption({
						xAxis: {
							data: noiseDate
						},
						series: [{
							data: noiseData
						}]
					});
					device[mac].temperatureChart.setOption({
						xAxis: {
							data: temperatureDate
						},
						series: [{
							data: temperatureData
						}]
					});

					device[mac].humChart.setOption({
						xAxis: {
							data: humDate
						},
						series: [{
							data: humData
						}]
					});
					device[mac].pressureChart.setOption({
						xAxis: {
							data: pressureDate
						},
						series: [{
							data: pressureData
						}]
					});
					break;
				case 'ma':
					device[mac].magneticChart.setOption({
						xAxis: {
							data: magneticDate
						},
						series: [{
							data: magneticxData
						}, {
							data: magneticyData
						}, {
							data: magneticzData
						}, {
							data: magnetometerRData
						}]
					})
					break;
			}
		}
		refChart(value.type);
	}


	let writeSpecialValue = function (mac) {
		// device[arg[1]].connect=true
		api.write({
			node: mac,
			handle: 59,
			value: device.fre1,
			success: function () {
				api.write({
					node: mac,
					handle: 57,
					value: '01'
				});
				api.write({
					node: mac,
					handle: 65,
					value: '01'
				})
			}
		});

	};

	let dataParse = function (str, id) {
		let reverseByte = function (str) {
			let temp = '',
				i = str.length
			for (i; i >= 2; i -= 2) {
				temp += str[i - 2] + str[i - 1]
			}
			return temp
		}
		let splitString = function (str, byte1, byte2) {
			function sum(arr, index) {
				let _arr = arr.slice(0, index)
				if (_arr.length !== 0) {
					return _arr.reduce(function (prev, cur, index, arr) {
						return prev + cur
					})
				}
				return 0
			}

			let temp = [],
				byteArr = Array.prototype.slice.call(arguments, 1),
				length = byteArr.length
			byteArr = byteArr.map(function (item) {
				return item * 2
			})
			for (let i = 0; i < length; i++) {
				temp.push(parseInt(reverseByte(str.substr(sum(byteArr, i), byteArr[i])), 16))
			}
			return temp
		}


		let _data = null,
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
			lowData1.forEach(function (item, index) {
				let temp = splitString(item, 4, 1, 4, 4, 4, 1, 1)
				light.push(temp[0] / 1000)
				noise.push(temp[1])
				pressure.push(temp[2] / 1000)
				temperature.push(temp[3] / 1000)
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
				hum: hum[0],
				temperature: temperature[0]
			}

		}
		if (temp === '02') {
			lowData2.push(str.substring(2))
			lowData2.forEach(function (item, index) {
				let temp = splitString(item, 2, 2, 2, 2, 1)
				magnetometer.push({
					x: temp[0],
					y: temp[1],
					z: temp[2]
				})
				magnetometerR.push(temp[3])
				ledStatus.push(temp[4])
				// console.log('Ma', {
				// 	x: temp[0],
				// 	y: temp[1],
				// 	z: temp[2]
				// })
			})

			return {
				time: new Date().getTime(),
				type: 'ma',
				ma: [magnetometer[0].x, magnetometer[0].y, magnetometer[0].z],
				mar: magnetometerR[0]
			}
		}

		hiData.push(str)
		hiData.forEach(function (item, index) {
			acc.push({
				x: parseInt(reverseByte(item.substr(0, 4)), 16) / 1000,
				y: parseInt(reverseByte(item.substr(4, 4)), 16) / 1000,
				z: parseInt(reverseByte(item.substr(8, 4)), 16) / 1000
			})
			// console.log('acc', {
			// 	x: parseInt(reverseByte(item.substr(0, 4)), 16) / 1000,
			// 	y: parseInt(reverseByte(item.substr(4, 4)), 16) / 1000,
			// 	z: parseInt(reverseByte(item.substr(8, 4)), 16) / 1000
			// });
			gyro.push({
				x: parseInt(reverseByte(item.substr(12, 4)), 16) / 1000,
				y: parseInt(reverseByte(item.substr(16, 4)), 16) / 1000,
				z: parseInt(reverseByte(item.substr(20, 4)), 16) / 1000
			})


			// console.log('gyro', {
			// 	x: parseInt(reverseByte(item.substr(12, 4)), 16) / 1000,
			// 	y: parseInt(reverseByte(item.substr(16, 4)), 16) / 1000,
			// 	z: parseInt(reverseByte(item.substr(20, 4)), 16) / 1000
			// });
		})

		return {
			id: id,
			time: new Date().getTime(),
			type: 'ag',
			acc: [acc[0].x, acc[0].y, acc[0].z],
			gyro: [gyro[0].x, gyro[0].y, gyro[0].z]
		}
	}


})