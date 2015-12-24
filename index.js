var gpsd = require('node-gpsd');
var http = require('http');
var request = require('request');

var next_gps_time = new Date();
var gps_interval = 60000;


Rely on OS to daemonize GPSD (default on rPi)

var daemon = new gpsd.Daemon({
    program: 'gpsd',
    device: '/dev/ttyUSB0',
    port: 2947,
    pid: '/tmp/gpsd.pid',
    logger: {
        info: function() {},
        warn: console.warn,
        error: console.error
    }
});

var listener = new gpsd.Listener({
    port: 2947,
    hostname: 'localhost',
    logger:  {
        info: function() {},
        warn: console.warn,
        error: console.error
    },
    parse: true
});

listener.on('TPV', function (tpv) {
  if(next_gps_time < Date.now()){
    var gps_data = {
        time : Date.now(),
	lng : tpv.lon,
	lat : tpv.lat,
	alt : tpv.alt,
	speed : tpv.speed,
	heading : tpv.track,
	lng_err : tpv.epx,
	lat_err : tpv.epy,
	alt_err : tpv.epv,
	speed_err : tpv.eps
    };
    post_gps(gps_data);
    next_gps_time = new Date(next_gps_time.getTime() + gps_interval);
  }
});

listener.connect(function() {
  console.log('Connected');
  listener.watch();
});
 
function post_gps(data){
  console.log({data: data});
  var post_options = {
    url: 'http://localhost:16006/api/gps',
    form: { data: { 
        "type": "gps",
        "attributes": data 
        }
      },
    headers: {
      'Content-Type': 'application/vnd.api+json'
    }
  }
  request.post(post_options,
    function (error, response, body){
      console.log("Response: " + JSON.stringify(response) );
    }
  );
}


