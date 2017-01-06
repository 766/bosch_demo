let accChart = echarts.init(document.getElementById('acc'));
let gyroChart = echarts.init(document.getElementById('gyro'));
let lightChart = echarts.init(document.getElementById('light'));
let noiseChart = echarts.init(document.getElementById('noise'));
let temperatureChart = echarts.init(document.getElementById('temperature'));
let humChart = echarts.init(document.getElementById('hum'));
let pressureChart = echarts.init(document.getElementById('pressure'));
let accxData = [];
let accyData = [];
let acczData = [];
let accDate = [];

let gyroxData = [];
let gyroyData = [];
let gyrozData = [];
let gyroDate = [];

let lightData = [];
let lightDate = [];
let noiseData = [];
let noiseDate = [];
let temperatureData = [];
let temperatureDate = [];
let humData = [];
let humDate = [];
let pressureData = [];
let pressureDate = [];
//***chart options*****//
let tooltip = {
    trigger: 'axis',
    formatter: function (params) {
        params = params[0];
        let date = new Date(params.name);
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</br>' + params.value;
    },
};

let grid = {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
};

let xAxis = {
    type: 'category',
    boundaryGap: false,
    axisLabel: {
        formatter: function (value, idx) {
            let date = new Date(value);
            return [date.getMonth() + 1, date.getDate()].join('-');
        }
    }, data: []
};

let yAxis = {
    type: 'value'
};

let series = [{
    type: 'line'
}];

accChart.setOption({
    title: {
        text: '加速度'
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            params = params[0];
            let date = new Date(params.name);
            return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</br>' + params.value;
        },
    },
    xAxis: xAxis,
    yAxis: yAxis,
    series: [{
        type: 'line'
    }, {
        type: 'line'
    }, {
        type: 'line'
    }]
});
gyroChart.setOption({
    title: {
        text: '陀螺仪'
    },
    tooltip: tooltip,
    xAxis: xAxis,
    yAxis: yAxis,
    series: [{
        type: 'line'
    }, {
        type: 'line'
    }, {
        type: 'line'
    }]
});
lightChart.setOption({
    title: {
        text: '光照'
    },
    tooltip: tooltip,
    xAxis: xAxis,
    yAxis: yAxis,
    series: series
});
noiseChart.setOption({
    title: {
        text: '声感'
    },
    tooltip: tooltip,
    xAxis: xAxis,
    yAxis: yAxis,
    series: series
});
temperatureChart.setOption({
    title: {
        text: '温度'
    },
    tooltip: tooltip,
    xAxis: xAxis,
    yAxis: yAxis,
    series: series
});
humChart.setOption({
    title: {
        text: '湿度'
    },
    tooltip: tooltip,
    xAxis: xAxis,
    yAxis: yAxis,
    series: series
});
pressureChart.setOption({
    title: {
        text: '压力'
    },
    tooltip: tooltip,
    xAxis: xAxis,
    yAxis: yAxis,
    series: series
});


let body = $('body')
let hubIP = '',
    devicesMac = '',
    reg_ip = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
    reg_mac = /^[0-f]{2}\:[0-f]{2}\:[0-f]{2}\:[0-f]{2}\:[0-f]{2}\:[0-f]{2}$/i;
let dd, bosch = null;

if (localStorage.bosch) {
    bosch = JSON.parse(localStorage.bosch)
    if (reg_ip.test(bosch[0]) && reg_mac.test(bosch[1])) {
        $('#hub_ip').val(bosch[0])
        $('#device_mac').val(bosch[1])
    }
}

function getIpMac() {
    hubIP = $('#hub_ip').val().trim()
    devicesMac = $('#device_mac').val().trim()
    if (!reg_ip.test(hubIP) || !reg_mac.test(devicesMac)) {
        alert('hubIP或者MAC输入错误')
        return
    }
    localStorage.setItem('bosch', JSON.stringify([hubIP, devicesMac]))
}

let dataHandle = function (hub, data) {
    if (data !== ':keep-alive') {
        _data = JSON.parse(data)
        dd = (dataParse(_data.value))
        notify(dd)
    }
}

getIpMac()
api
    .use({
        server: hubIP,
        hub: ''
    })
    .on('notify', dataHandle)
$('#disconnect').on('click', function () {
    getIpMac()
    api
        .use({
            server: hubIP,
            hub: ''
        }).disconn({
        node: devicesMac
    })
})


body.delegate('#connect', 'click', function () {
    //此接口用于连接设备
    console.log('connect clicked');
    getIpMac()
    api.on('conn', writeSpecialValue)
        .conn({
            node: devicesMac,
            type: 'public'
        })
    
});

function fillData(dataArr, timeArr, data, time) {
    if (dataArr.length > 50 || timeArr.length > 50) {
        dataArr.shift();
        timeArr.shift();
    }
    dataArr.push(data);
    timeArr.push(time);
}
function refChart(type) {
    switch (type) {
        case 'ag':
            accChart.setOption({
                xAxis: {
                    data: accDate
                },
                series: [
                    {data: accxData},
                    {data: accyData},
                    {data: acczData}]
            });
            gyroChart.setOption({
                xAxis: {
                    data: gyroDate
                },
                series: [
                    {data: gyroxData},
                    {data: gyroyData},
                    {data: gyrozData}]
            });
            break;
        case 'en':
            lightChart.setOption({
                xAxis: {
                    data: lightDate
                },
                series: [{
                    data: lightData
                }]
            });
            noiseChart.setOption({
                xAxis: {
                    data: noiseDate
                },
                series: [{
                    data: noiseData
                }]
            });
            temperatureChart.setOption({
                xAxis: {
                    data: temperatureDate
                },
                series: [{
                    data: temperatureData
                }]
            });
            
            humChart.setOption({
                xAxis: {
                    data: humDate
                },
                series: [{
                    data: humData
                }]
            });
            pressureChart.setOption({
                xAxis: {
                    data: pressureDate
                },
                series: [{
                    data: pressureData
                }]
            });
            break;
        case 'ma':
            break
    }
}
function notify(value) {
    //收到数据后调用这个接口通知我
    if (accDate.length >= 50) {
        accxData.shift();
        accyData.shift();
        acczData.shift();
        accDate.shift();
    }
    
    if (gyroDate.length >= 50) {
        gyroxData.shift();
        gyroyData.shift();
        gyrozData.shift();
        gyroDate.shift();
    }
    
    if (lightData.length >= 50) {
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
    switch (value.type) {
        case 'ag':
            accDate.push(value.time);
            accxData.push(value.acc[0])
            accyData.push(value.acc[1])
            acczData.push(value.acc[2])
            
            gyroDate.push(value.time);
            gyroxData.push(value.gyro[0])
            gyroyData.push(value.gyro[1])
            gyrozData.push(value.gyro[2])
            
            refChart(value.type);
            break;
        case 'en':
            let time = value.time;
            lightData.push(value.light);
            lightDate.push(time);
            noiseData.push(value.noise);
            noiseDate.push(time);
            temperatureData.push(value.temperature);
            temperatureDate.push(time);
            humData.push(value.hum);
            humDate.push(time);
            pressureData.push(value.pressure);
            pressureDate.push(time);
            
            refChart(value.type);
            break;
        case 'ma':
            break;
        
    }
}

function limitDataLength(arr, length) {
    
}

let writeSpecialValue = function (e, args) {
    api.write({
        node: devicesMac,
        handle: 57,
        value: '01'
    });
    api.write({
        node: devicesMac,
        handle: 59,
        value: '64000000'
    });
    api.write({
        node: devicesMac,
        handle: 65,
        value: '01'
    })
};

let dataParse = function (str) {
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
            temp.push(parseInt(str.substr(sum(byteArr, i), byteArr[i]), 16))
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
        acc: [acc[0].x, acc[0].y, acc[0].z],
        gyro: [gyro[0].x, gyro[0].y, gyro[0].z]
    }
}