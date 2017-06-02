/** @jsx html */

import { html } from 'snabbdom-jsx';
import snabbdom from '../snabbdom';
////..
const patch = snabbdom.init([
  require('../snabbdom/modules/class'),
  require('../snabbdom/modules/props'),
  require('../snabbdom/modules/style'),
  require('../snabbdom/modules/attributes'),
  require('../snabbdom/modules/eventlisteners')
]);

var idx = 1;
var li = [];
var listNode = render();

patch(document.getElementById('list'), listNode);

function addItem(){
	li.push( idx++ );
	var newNode = render(); 
	listNode = patch(listNode, newNode);
}

var g = 100;

function repaceIdx(){
	li = li.map(function(d, i){
		return d + g++;
	});
	var newNode = render(); 
	listNode = patch(listNode, newNode);	
}

function delItem(i){
	li.splice(i,1);	
	var newNode = render(); 
	listNode = patch(listNode, newNode);
}

function render(){
	var lis = li.map(function(d, i){
					return <li key={i}>{i}=>{d}------<span on-click={index=>delItem(index)} style={{cursor: 'pointer'}}>x</span></li>
				});
	return <div>
   		<button on-click={addItem}>新增</button>
    	<button on-click={repaceIdx}>重设</button>
		<ul>
			{lis}
		</ul>
	</div>;	
}

//on-click={ _ => alert('Hi ' + name) }
//HelloMessage : (attrs, body) -> vnode
const HelloMessage = (data, p) => {
 var name = data.name;
 return <div id="test" attrs={{'shref' : data.cid}}>
    {name}
	<div>
	{p}
	</div>
	0999
  </div>
};

let time = ~~(+new Date / 1000);
  
const test = <div>Hello JSX{time}</div>; 

var i = 1;


var vnode = <HelloMessage name="Yassine" cid={i}>a<div>1</div>{test}<div>2</div>b</HelloMessage>

setInterval(function(){
	let time = ~~(+new Date / 1000);
	const test = <div>Hello JSX{time}</div>; 
	i++;
	let newNode = <HelloMessage name="Yassine" cid={i}>a<div>1</div>{test}<div>2</div>b</HelloMessage>	
	vnode = patch(vnode, newNode);
}, 1000);

patch(document.getElementById('placeholder'), vnode);

var TreeStore = [
	{ 
		text : '跟节点',
		children : [
			{ text : '文件夹<strong>A</strong>',expand : false, children : [
				{ text : '文件.txt' }
			], leaf : false},
			{ text : '文件夹B', leaf : false, children : [
				{ text : '文件夹X', leaf : false }
			] },
			{ text : '文件夹C', leaf : false },
			{ text : '文件夹D', leaf : false }
		].concat((function(){
			var count = 3000;
			var d = [];
			for( var i=1;i<=count;i++ ) {
				d.push( {
					text : '文件夹'+i,
					leaf : false
				} );	
			}	
			return d;
		})())
	}
];

class Tree {
	constructor(data){
		this.data = data;
		this.getTreeView();
		console.time('renderTree');
		this.vnode = patch(document.getElementById('tree'), this.render());
		console.timeEnd('renderTree');
		this.idx = 1;
	}
	
	isLeaf(node){
		return node.leaf === undefined ? true : node.leaf;		
	}
	
	addChild( pnode ){
		if( !pnode.children ) {
			pnode.children = [];
		}	
		
		pnode.children.push({
			text : '文件' + this.idx++	
		});
		
		pnode.expand = true;
		
		this.forceUpdate();
	}
	
	removeChild(childs, i){
		
		childs.splice(i, 1);
		
		this.forceUpdate();
	}
	//
	getChildItem(data){
		var child = data.children;
		if( !child ) return [];
		return <ul style={{ display: data.expand === false ? 'none' : 'block' }}>{child.map((node, i) => 
			 <li key={i}>
				<div>{node.text} { this.isLeaf(node) ? <span style={{cursor: 'pointer'}} on-click={()=> this.removeChild(child,i)}>-</span> : <span style={{cursor: 'pointer'}} on-click={()=> this.addChild(node)}>+</span>}</div>
				{this.getChildItem(node)}
			</li> 
			
		)}</ul>
	}
	
	getTreeView(){
		return this.getChildItem(this.data[0]);
	}
	
	render(){
		return this.getTreeView();
	}
	
	forceUpdate(){
		console.time('renderTree');
		this.vnode = patch(this.vnode, this.render());	
		console.timeEnd('renderTree');
	}
}

var tree = new Tree(TreeStore);