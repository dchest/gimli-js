Gimli in JavaScript
===================

"Gimli is a 384-bit permutation designed to achieve high security with high
performance across a broad range of platforms."

https://gimli.cr.yp.to/

This is a JavaScript implementation of the permutation
and a sponge-based hash function (XOF).

Installation
------------

```
npm install gimli-crypto
```

But it's really small, maybe just copy and paste?

Usage
-----

### Permutation

```js
var gimli = require('gimli-crypto').gimli;
var state = new Uint8Array(48);
// state is 000000....0000
gimli(state);
// state is c4d867....302e
```

### Hash (eXtended Output Function)

```js
var hash = require('gimli-crypto').hash;

// 32-byte digest of [1,2,3,4,5,6] calculated in two steps.
var digest = hash()
                .write(new Uint8Array([1,2,3]))
                .write(new Uint8Array([4,5,6]))
                .read();

// 111-byte digest of [1,2,3]
var longDigest = new Uint8Array(111);
var data = new Uint8Array([1,2,3]);
hash().write(data).read(longDigest);

// XORing with output of XOF
var key = new Uint8Array([1,2,3]);
var text = new Uint8Array([4,5,6]);
hash().write(key).read(text, true);
// outputs Uint8Array [ 81, 10, 158 ]
```
