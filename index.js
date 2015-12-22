var gpsd = require('node-gpsd');

// 
// Rely on OS to daemonize GPSD (default on rPi)
// 
// var daemon = new gpsd.Daemon({
//     program: 'gpsd',
//     device: '/dev/ttyUSB0',
//     port: 2947,
//     pid: '/tmp/gpsd.pid',
//     logger: {
//         info: function() {},
//         warn: console.warn,
//         error: console.error
//     }
// });

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

listener.connect(function() {
    console.log('Connected');
});