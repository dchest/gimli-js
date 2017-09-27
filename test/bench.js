const gimli = require('../gimli');
const hash = require('../hash');

if (process.browser) {
    olog = console.log;
    console.log = function() {
        var a = [];
        for (var i = 0; i < arguments.length; i++)
            a.push(arguments[i]);
        olog.call(a);
        var el = document.createElement('code');
        el.innerText = a.map(x => JSON.stringify(x)).join(' ') + '\n';
        document.body.append(el);
    }
}

function bench() {
    var begin = Date.now();
    var times = 50 * 64 * 1024;
    var state = new Uint8Array(48);
    for (var i = 0; i < times; i++) gimli(state);
    var diff = Date.now() - begin;
    console.log(diff + 'ms per ' + times + ' ops')
    console.log('rate: 128', 50 * 1000 / diff + ' MiB/s');
    console.log('rate:full', 50 * 1000 * 3 / diff + ' MiB/s');
}

function benchhash() {
    var d = new Uint8Array(1024);
    var begin = Date.now();
    var h = hash();
    for (var i = 0; i < 1024; i++) h.write(d);
    h.read();
    var diff = Date.now() - begin;
    console.log(diff + 'ms per 1 MB');
    console.log('hash: ', 1000 / diff + ' MiB/s');
}

function benchread() {
    var d = new Uint8Array(1024);
    var begin = Date.now();
    var h = hash();
    h.write(new Uint8Array(32)); // key
    for (var i = 0; i < 1024; i++) h.read(d);
    var diff = Date.now() - begin;
    console.log(diff + 'ms per 1 MB');
    console.log('read: ', 1000 / diff + ' MiB/s');
}

bench();
benchhash();
benchread();
