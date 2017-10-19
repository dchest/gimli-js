const gimli = require('../gimli');
const hash = require('../hash');
const b = require('@stablelib/benchmark')

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
    var state = new Uint8Array(48);
    b.report("Gimli (rate: 128)", b.benchmark(function() {
        gimli(state)
    }, 16));
    b.report("Gimli (rate: full)", b.benchmark(function () {
        gimli(state)
    }, 48));
}

function benchhashwrite() {
    var h = hash();
    var d = new Uint8Array(1024);
    b.report("Gimli hash (write)", b.benchmark(function () {
        h.write(d);
    }, 1024));
}

function benchhashread() {
    var h = hash();
    var d = new Uint8Array(1024);
    b.report("Gimli hash (read)", b.benchmark(function () {
        h.read(d);
    }, 1024));
}

bench();
benchhashwrite();
benchhashread();
