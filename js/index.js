var myChart = echarts.init(document.getElementById('main'));

function randomData() {
    return parseInt(Math.random() * (210 - 180 + 1) + 180);
}

function randomDate() {
    now = new Date(+now + oneDay);
    return now.toLocaleDateString()
}

var data = [];
var date = [];
var now = +new Date(1997, 9, 3);
var oneDay = 24 * 3600 * 1000;
var value = Math.random() * 1000;
for (var i = 0; i < 10; i++) {
    date.push(randomDate());
    data.push(randomData());
}

option = {
    // title: {
    //     text: '折线图堆叠'
    // },
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            type: 'line',
            stack: '总量',
            data: data
        }
    ]
};

myChart.setOption(option);


setInterval(function () {
    
    for (var i = 0; i < 1; i++) {
        data.shift();
        date.shift();
        data.push(randomData());
        date.push(randomDate());
    }
    
    myChart.setOption({
        xAxis: {
            data: date
        },
        series: [{
            data: data
        }]
    });
}, 1000);


var body = $('body');

body.delegate('#connect', 'click', function () {
    //此接口用于连接设备
    console.log('connect clicked');
});

function notify(data) {
    //收到数据后调用这个接口通知我
}
