/** @jsx html */

import { html } from 'snabbdom-jsx';
import snabbdom from '../vdom/snabbdom';
import createClass from '../vdom/component';
import h from '../vdom/h';
////..
const patch = snabbdom.init([
    require('../vdom/modules/class'),
    require('../vdom/modules/props'),
    require('../vdom/modules/style'),
    require('../vdom/modules/attributes'),
    require('../vdom/modules/eventlisteners')
]);


//..
function toVnode(vnode){
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
    return vnode
}

let time = ~~(+new Date / 1000);
//on-click={ _ => alert('Hi ' + name) }
//HelloMessage : (attrs, body) -> vnode
const HelloMessage = (data, p) => {
    return <div>
            <div>{time}</div>
            <MyButton />
        </div>
};
////.

const test = < div > Hello JSX { time } < /div>; 

var i = 1;

var Button = createClass({
    name : 'Button',
    render() {
        return <button on-click = {
            () => {
                time = ~~(+new Date / 1000);
                //if( btns.length > 10 ) {
                btns.splice(btns.length-1, 1)
                
                console.log(btns.length);//
                btns.sort(function(){
                    return 0.5 - Math.random();
                })//['d', 'a', 'c', 'b'];
                let newNode = < HelloMessage ></HelloMessage>;
                console.log(newNode);///...
                vnode = patch(vnode, toVnode(newNode));
            }
        } >{this.props.children}< /button>	
    }
});
//
var btns = ['a', 'b', 'c', 'd'];
var MyButton = createClass({
            name : 'MyButton',
            render() {
                return <div>
                    <Button><strong>Click me!</strong></Button>{
                        btns.map(d => <Button key={d}>{d}{(i++)}</Button>)
                        }</div>
                    }
            });
        //gad
        var vnode = < HelloMessage >< /HelloMessage>;
        //console.dir(vnode);//...
        vnode = patch(document.getElementById('placeholder'), vnode);
        window.vnode = vnode;
        console.log(vnode, 'end');



        