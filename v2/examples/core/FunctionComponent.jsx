/** @jsx Neact.createElement */

function MyApp(){}

var h = Neact.createElement;

MyApp.defaultProps = {
    name : 'nobo',
    x:1
}

var index = 3000;

var list = (function(num){
    var s = []
    for(var i = 1; i<= num;i++) {
        s.push(i);
    }
    return s;
})(index);

function getVNodes(){

var img = <img src={!(list.length % 5) ? 'http://avatar.csdn.net/6/B/7/3_q107770540.jpg' : 'http://avatar.csdn.net/6/6/D/1_yybjroam05.jpg'} width="50" height="50" />

var v1 = (
    <div key="test" ref={"xf"+index} id="fs">
        你是谁?
        {null}
        '当前条数:'{list.length}
        {
            [
                <a>href1</a>,
                <a>{img}</a>
            ]
        }
        <div mid="3" style={{
            border : '1px solid red',
            padding : list.length % 5
        }}>
            <h1>nobo({list[0]})</h1>
        </div>
        <input value="dadf" readOnly={true}></input>
        <select multiple={true} >
            <optgroup label="Swedish Cars">
                <option value ="volvo">Volvo</option>
                <option value ="saab">Saab</option>
            </optgroup>

            <optgroup label="German Cars">
                <option value ="mercedes">Mercedes</option>
                <option value ="audi">Audi</option>
            </optgroup>
            <option value="a">a</option>
            <option value="b">b</option>
            <option selected={true} value="c">c</option>
            <option value="d">d</option>
            <option value="e">e</option>
        </select>
        <List />
    </div>
);

var v2 = (
    <div style={{
        border : '5px solid red'
    }}>
       {v1} 
    </div>
);

return  (
    v1//list.length % 5 === 0 ? v2 : v1
);

}

function List(){
    return (
        <ul>
            {
                Neact.utils.map(list,function(v,i){
                    var events = {};
                    if(list.length > 10) {
                        if( list.length % 2 ) {
                            events.onClick = () =>  console.log('onClick...'); 
                        } else {
                            events.onDblClick = () =>  console.log('onDblClick...'); 
                        }
                    }

                    if(list.length > 15) {
                        events = {};
                    }
                    //{...events}
                    return <li id={i+'md'}><div>{v}<span style={{cursor:'pointer'}} onClick={()=>{
                            list.splice(i,1);
                             patch();   
                        }}>-</span>
                        </div></li>;
                })
            }
        </ul>
    );
}

var Container2 = Neact.createClass({
    componentWillMount(){
        console.log('Container2 componentWillMount')
    },
    componentDidMount(){
        console.log('Container2 componentDidMount')
        var self = this;
    },

    componentDidUpdate() {
        console.log('Container2 componentDidUpdate',arguments);
        var self = this;
    },


    render(){
       return <div ref="container" style={{
            border : '5px solid green'
        }}><A ref="A" />{getVNodes()}</div>; 
    }
});

function A(){
    return <B />;
}

function B(){
    return <C />;
}

function C(){
    return index % 2 ? <a>连接</a> : <div>连接变了</div>;
}

function MyApp(){
    return <Container2 />;
}

var lastVNode = <MyApp 
    onComponentWillMount={()=>console.log('onComponentWillMount')}
    onComponentDidMount={(dom)=>console.log('onComponentDidMount', dom)} 
/>;

console.log(Neact.render(lastVNode, demo));

function patch(){
    console.clear();
    list.push(++index);
    //list.sort(function(){
    //    return Math.random() - .5;
    //});
    var nextVNode = <MyApp 
    onComponentWillMount={()=>console.log('onComponentWillMount')}
    onComponentDidMount={(a,b,dom)=>console.log('onComponentDidMount', dom)} 
    />;
    console.time('patch')
    Neact.patch(lastVNode, nextVNode, demo);
    console.timeEnd('patch')
    lastVNode = nextVNode;
    //console.log(lastVNode);
    return;

    lastVNode = nextVNode;

    list.push(index++);
    list.sort(function(){
        return Math.random() - .5;
    });
    if(list.length > 20) {
        list.length = 10
    }
    var nextVNode = getVNodes();
    Neact.patch(lastVNode, nextVNode, demo);

    lastVNode = nextVNode;
}
