'use strict';

/** @jsx Neact.createElement */

function MyApp() {}

var h = Neact.createElement;

MyApp.defaultProps = {
    name: 'nobo',
    x: 1
};

var index = 3000;

var list = function (num) {
    var s = [];
    for (var i = 1; i <= num; i++) {
        s.push(i);
    }
    return s;
}(index);

function getVNodes() {

    var img = Neact.createElement('img', { src: !(list.length % 5) ? 'http://avatar.csdn.net/6/B/7/3_q107770540.jpg' : 'http://avatar.csdn.net/6/6/D/1_yybjroam05.jpg', width: '50', height: '50' });

    var v1 = Neact.createElement(
        'div',
        { key: 'test', ref: "xf" + index, id: 'fs' },
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
                    padding: list.length % 5
                } },
            Neact.createElement(
                'h1',
                null,
                'nobo(',
                list[0],
                ')'
            )
        ),
        Neact.createElement('input', { value: 'dadf', readOnly: true }),
        Neact.createElement(
            'select',
            { multiple: true },
            Neact.createElement(
                'optgroup',
                { label: 'Swedish Cars' },
                Neact.createElement(
                    'option',
                    { value: 'volvo' },
                    'Volvo'
                ),
                Neact.createElement(
                    'option',
                    { value: 'saab' },
                    'Saab'
                )
            ),
            Neact.createElement(
                'optgroup',
                { label: 'German Cars' },
                Neact.createElement(
                    'option',
                    { value: 'mercedes' },
                    'Mercedes'
                ),
                Neact.createElement(
                    'option',
                    { value: 'audi' },
                    'Audi'
                )
            ),
            Neact.createElement(
                'option',
                { value: 'a' },
                'a'
            ),
            Neact.createElement(
                'option',
                { value: 'b' },
                'b'
            ),
            Neact.createElement(
                'option',
                { selected: true, value: 'c' },
                'c'
            ),
            Neact.createElement(
                'option',
                { value: 'd' },
                'd'
            ),
            Neact.createElement(
                'option',
                { value: 'e' },
                'e'
            )
        ),
        Neact.createElement(List, null)
    );

    var v2 = Neact.createElement(
        'div',
        { style: {
                border: '5px solid red'
            } },
        v1
    );

    return v1 //list.length % 5 === 0 ? v2 : v1
    ;
}

function List() {
    return Neact.createElement(
        'ul',
        null,
        Neact.utils.map(list, function (v, i) {
            var events = {};
            if (list.length > 10) {
                if (list.length % 2) {
                    events.onClick = function () {
                        return console.log('onClick...');
                    };
                } else {
                    events.onDblClick = function () {
                        return console.log('onDblClick...');
                    };
                }
            }

            if (list.length > 15) {
                events = {};
            }
            //{...events}
            return Neact.createElement(
                'li',
                { id: i + 'md' },
                Neact.createElement(
                    'div',
                    null,
                    v,
                    Neact.createElement(
                        'span',
                        { style: { cursor: 'pointer' }, onClick: function () {
                                list.splice(i, 1);
                                patch();
                            } },
                        '-'
                    )
                )
            );
        })
    );
}

var Container2 = Neact.createClass({
    componentWillMount: function () {
        console.log('Container2 componentWillMount');
    },
    componentDidMount: function () {
        console.log('Container2 componentDidMount');
        var self = this;
    },
    componentDidUpdate: function () {
        console.log('Container2 componentDidUpdate', arguments);
        var self = this;
    },
    render: function () {
        return Neact.createElement(
            'div',
            { ref: 'container', style: {
                    border: '5px solid green'
                } },
            Neact.createElement(A, { ref: 'A' }),
            getVNodes()
        );
    }
});

function A() {
    return Neact.createElement(B, null);
}

function B() {
    return Neact.createElement(C, null);
}

function C() {
    return index % 2 ? Neact.createElement(
        'a',
        null,
        '\u8FDE\u63A5'
    ) : Neact.createElement(
        'div',
        null,
        '\u8FDE\u63A5\u53D8\u4E86'
    );
}

function MyApp() {
    return Neact.createElement(Container2, null);
}

var lastVNode = Neact.createElement(MyApp, {
    onComponentWillMount: function () {
        return console.log('onComponentWillMount');
    },
    onComponentDidMount: function (dom) {
        return console.log('onComponentDidMount', dom);
    }
});

console.log(Neact.render(lastVNode, demo));

function patch() {
    console.clear();
    list.push(++index);
    //list.sort(function(){
    //    return Math.random() - .5;
    //});
    var nextVNode = Neact.createElement(MyApp, {
        onComponentWillMount: function () {
            return console.log('onComponentWillMount');
        },
        onComponentDidMount: function (a, b, dom) {
            return console.log('onComponentDidMount', dom);
        }
    });
    console.time('patch');
    Neact.patch(lastVNode, nextVNode, demo);
    console.timeEnd('patch');
    lastVNode = nextVNode;
    //console.log(lastVNode);
    return;

    lastVNode = nextVNode;

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