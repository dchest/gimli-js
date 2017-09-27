const gimli = require('../gimli');
const hash = require('../hash');

function test() {
    var state = new Uint8Array(48);
    for (var i = 0; i < 50 * 64 * 1024; i++) gimli(state);
    var r = Buffer.from(state).toString('hex')
    console.log(r);
    if (r !== 'f362dcc0f6c36bb7e626a86ac15b7c25b392eb6df277979f40b91b6dc6846079fb7427955d6479a5abe65d477abdee9c')
        throw new Error('Test failed');
}

function testhash() {
    var h = hash().write([1, 2, 3]).write([1, 2, 3]).read();
    console.log(Buffer.from(h).toString('hex'));

    // NB: test vectors in the original paper from 2017.06.27 are wrong.
    // We use the correct ones.
    var vectors = [
        {
            data: '',
            hash: 'b0634b2c0b082aedc5c0a2fe4ee3adcfc989ec05de6f00addb04b3aaac271f67'
        },
        {
            data: "There's plenty for the both of us, may the best Dwarf win.",
            hash: '4afb3ff784c7ad6943d49cf5da79facfa7c4434e1ce44f5dd4b28f91a84d22c8'
        },
        {
            data: "If anyone was to ask for my opinion, which I note they're not, I'd say we were taking the long way around.",
            hash: 'ba82a16a7b224c15bed8e8bdc88903a4006bc7beda78297d96029203ef08e07c'
        },
        {
            data: "Speak words we can all understand!",
            hash: '8dd4d132059b72f8e8493f9afb86c6d86263e7439fc64cbb361fcbccf8b01267'
        },
        {
            data: "It's true you don't see many Dwarf-women. And in fact, they are so alike in voice and appearance, that they are often mistaken for Dwarf-men.  And this in turn has given rise to the belief that there are no Dwarf-women, and that Dwarves just spring out of holes in the ground! Which is, of course, ridiculous.",
            hash: 'ebe9bfc05ce15c73336fc3c5b52b01f75cf619bb37f13bfc7f567f9d5603191a'
        }
    ];

    vectors.forEach((v, i) => {
        var h = Buffer.from(hash()
            .write(Buffer.from(v.data))
            .read()).toString('hex');
        if (h != v.hash) {
            console.log('expected:', v.hash);
            console.log('got     :', h);
            throw new Error('Hash test failed');
        }
    });
}

test();
testhash();
