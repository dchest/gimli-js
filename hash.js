// @ts-check
var gimli = require('./gimli');

/**
 * Hash with arbitrary output length based on Gimli in sponge mode.
 *
 * @param {number} [padbyte] - padding byte (0x1f by default)
 * @param {number} [rate] - absorption/squeezing rate (16 by default)
 */
function hash(padbyte, rate) {
    if (padbyte == null) padbyte = 0x1f;
    if (rate == null) rate = 16;
    var s = new Uint8Array(48), p = 0, padded = false;

    /**
     * Updates hash with data.
     *
     * @param {Uint8Array} d - input data
     * @returns {this}
     */
    function write(d) {
        for (var i = 0; i < d.length; i++) {
            s[p++] ^= d[i];
            if (p === rate) {
                gimli(s);
                p = 0;
            }
        }
        return this;
    }

    /**
     * Squeezes result into d and returns it.
     * If d is undefined, allocates a new 32-byte array.
     *
     * @param {Uint8Array} [d] - output data (optional)
     * @param {boolean} xor - if true, XOR into d instead of copying
     * @returns {Uint8Array}
     */
    function read(d, xor) {
        d = d || new Uint8Array(32);
        if (!padded) {
            padded = true;
            s[p] ^= padbyte;
            s[rate - 1] ^= 0x80;
            p = rate;
        }
        for (var i = 0; i < d.length; i++) {
            if (p === rate) {
                gimli(s);
                p = 0;
            }
            if (xor)
                d[i] ^= s[p++];
            else
                d[i] = s[p++];
        }
        return d;
    }

    return {
        write: write,
        read: read
    };
}

module.exports = hash;
