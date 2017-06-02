'use strict';

/** @jsx Neact.createElement */

function MyApp() {}

var h = Neact.createElement;

MyApp.defaultProps = {
    name: 'nobo',
    x: 1
};

var index = 7;

var list = [1, 2, 3, 4, 5, 6];

function getVNodes() {

    var img = Neact.createElement('img', { src: !(list.length % 5) ? 'http://avatar.csdn.net/6/B/7/3_q107770540.jpg' : 'http://avatar.csdn.net/6/6/D/1_yybjroam05.jpg', width: '50', height: '50' });

    var v1 = Neact.createElement(
        'div',
        { key: 'test', ref: 'xf', id: 'fs', onClick: 'ddfdf' },
        '\u4F60\u662F\u8C01?',
        null,
        '\'\u5F53\u524D\u6761\u6570:\'',
        list.length,
        [Neact.createElement(
            'a',
            null,
            'href1'
        ), Neact.createElement(
            'a',
            null,
            img
        )],
        Neact.createElement(
            'div',
            { mid: '3', style: {
                    border: '1px solid red',
                    padding: 10
                } },
            Neact.createElement(
                'h1',
                null,
                'nobo(',
                list[0],
                ')'
            )
        ),
        Neact.createElement(
            'ul',
            null,
            Neact.utils.map(list, function (v, i) {
                return Neact.createElement(
                    'li',
                    { key: v },
                    v
                );
            })
        )
    );

    var v2 = Neact.createElement(
        'div',
        { style: {
                border: '5px solid red'
            } },
        v1
    );

    return list.length % 5 === 0 ? v2 : v1;
}

var lastVNode = getVNodes();

Neact.render(lastVNode, demo);

function patch() {
    list.push(index++);
    list.sort(function () {
        return Math.random() - .5;
    });
    if (list.length > 20) {
        list.length = 10;
    }
    var nextVNode = getVNodes();
    Neact.patch(lastVNode, nextVNode, demo);

    lastVNode = nextVNode;
}

setInterval(function () {
    patch();
}, 500);