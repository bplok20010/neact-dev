/** @jsx Neact.createElement */

var num = 0;
//1
var TreeStore = [{
    text: '跟节点',
    children: [{ text: '文件夹<strong>A</strong>', expand: false, children: [{ text: '文件.txt' }], leaf: false }, { text: '文件夹B', leaf: false, children: [{ text: '文件夹X', leaf: false }] }, { text: '文件夹C', leaf: false }, { text: '文件夹D', leaf: false }].concat(function() {
        var count = 3000;
        var d = [];
        for (var i = 1; i <= count; i++) {
            d.push({
                text: '文件夹' + i,
                leaf: false
            });
        }
        return d;
    }())
}];

class TreeItem extends Neact.Component {

    shouldComponentUpdate(nextProps){
        return this.props.children != nextProps.children
    }

    render(){
       
        var text = this.props.stext;
        return <li idx={this.props.idx}>
            <div>
            {text} 
            <span style="cursor:pointer" onClick={()=> this.props.onRemove()} dangerouslySetInnerHTML={{__html : '<b>-</b>'}} ></span> 
            <span style="cursor:pointer" onClick={()=> this.props.onAdd()}> +</span>
            </div>
            {this.props.children}
        </li>;
    }

}

class TreeNode extends Neact.Component {
    constructor(){
        super(...arguments);
        this.state = {
            idx : 1
        };
    }
     addChild(pnode) {
        if (!pnode.children) {
            pnode.children = [];
        }

        pnode.children.push({
            text: '文件' + this.state.idx++
        });

        pnode.children = [].concat(pnode.children);

        pnode.expand = true;

        console.time('tree')
        this.props.updateFn();
        console.timeEnd('tree')

    }
    removeChild(d, i) {

        if(!d.children) return;
        d.children.splice(i, 1);
        if(!d.children.length) d.children=null;
        console.time('tree')
       // this.props.updateFn();
       this.forceUpdate();
        console.timeEnd('tree')
    }
    render(){
        var _this = this;
        var node = this.props.node;
        var returnValue = null;
        if(node.children) {
           returnValue = (
            <ul>
            {
                Neact.util.map(node.children, function(d, i){
                    if(!d) return null;
                    return <TreeItem key={i} node = {d} idx = {i} stext={d.text} onAdd={()=> _this.addChild(d)} onRemove={()=> _this.removeChild(node, i)}>
                            {!d.children ? null: <TreeNode node={d} updateFn = {()=> _this.forceUpdate()} />}
                    </TreeItem>;
                })
            }
            </ul>
           ); 
        } else {
            returnValue = <TreeItem stext={node.text} onAdd={()=> _this.addChild(node)} onRemove={()=> _this.removeChild(node, i)}>
                            {null}
                    </TreeItem>;
        }
        return returnValue;
    }

}


var Tree = Neact.createClass({
    
    isLeaf: function isLeaf(node) {
        return node.leaf === undefined ? true : node.leaf;
    },
    
    render: function() {
        return <TreeNode node={this.props.data[0]} updateFn = {()=> this.forceUpdate()}  />;
    },

    componentDidMount : function(){
       // setInterval(()=> this.forceUpdate(), 1000)
    }
});


var vnode = (
    <div>
    <Tree data={ TreeStore } />
    </div>
);

var render = Neact.render(vnode, document.body);

//var render1 = Neact.render(Neact.createElement(A1), document.body);


window.render = render;