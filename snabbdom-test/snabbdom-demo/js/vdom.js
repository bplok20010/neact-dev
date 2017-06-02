'use strict';

var _snabbdomJsx = require('snabbdom-jsx');

var _snabbdom = require('../vdom/snabbdom');

var _snabbdom2 = _interopRequireDefault(_snabbdom);

var _component = require('../vdom/component');

var _component2 = _interopRequireDefault(_component);

var _h = require('../vdom/h');

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

////..
/** @jsx html */

var patch = _snabbdom2['default'].init([require('../vdom/modules/class'), require('../vdom/modules/props'), require('../vdom/modules/style'), require('../vdom/modules/attributes'), require('../vdom/modules/eventlisteners')]);

//..
function toVnode(vnode) {
    /*
    if(!vnode.sel) return vnode; 
    if (typeof vnode.sel === 'function') {
            vnode.$vnode = new vnode.sel(vnode);
            var childs = vnode.$vnode.render();
            vnode.children = childs;
    }
    vnode.children = vnode.children instanceof Array ? vnode.children : [vnode.children];
    vnode.children = vnode.children.map(d=> toVnode(d));
    */
    return vnode;
}

var time = ~~(+new Date() / 1000);
//on-click={ _ => alert('Hi ' + name) }
//HelloMessage : (attrs, body) -> vnode
var HelloMessage = function HelloMessage(data, p) {
    return (0, _snabbdomJsx.html)(
        'div',
        null,
        (0, _snabbdomJsx.html)(
            'div',
            null,
            time
        ),
        (0, _snabbdomJsx.html)(MyButton, null)
    );
};
////.

var test = (0, _snabbdomJsx.html)(
    'div',
    null,
    ' Hello JSX ',
    time,
    ' '
);

var i = 1;

var Button = (0, _component2['default'])({
    name: 'Button',
    render: function render() {
        return (0, _snabbdomJsx.html)(
            'button',
            { 'on-click': function onClick() {
                    time = ~~(+new Date() / 1000);
                    //if( btns.length > 10 ) {
                    btns.splice(btns.length - 1, 1);

                    console.log(btns.length); //
                    btns.sort(function () {
                        return 0.5 - Math.random();
                    }); //['d', 'a', 'c', 'b'];
                    var newNode = (0, _snabbdomJsx.html)(HelloMessage, null);
                    console.log(newNode); ///...
                    vnode = patch(vnode, toVnode(newNode));
                } },
            this.props.children
        );
    }
});
//
var btns = ['a', 'b', 'c', 'd'];
var MyButton = (0, _component2['default'])({
    name: 'MyButton',
    render: function render() {
        return (0, _snabbdomJsx.html)(
            'div',
            null,
            (0, _snabbdomJsx.html)(
                Button,
                null,
                (0, _snabbdomJsx.html)(
                    'strong',
                    null,
                    'Click me!'
                )
            ),
            btns.map(function (d) {
                return (0, _snabbdomJsx.html)(
                    Button,
                    { key: d },
                    d,
                    i++
                );
            })
        );
    }
});
//gad
var vnode = (0, _snabbdomJsx.html)(HelloMessage, null);
//console.dir(vnode);//...
vnode = patch(document.getElementById('placeholder'), vnode);
window.vnode = vnode;
console.log(vnode, 'end');