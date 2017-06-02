/** @jsx Neact.createElement */

function MyApp(){}

var h = Neact.createElement;

MyApp.defaultProps = {
    name : 'nobo',
    x:1
}

var index = 7;

var list = [1,2,3,4,5,6];

function getVNodes(){

var img = <img src={!(list.length % 5) ? 'http://avatar.csdn.net/6/B/7/3_q107770540.jpg' : 'http://avatar.csdn.net/6/6/D/1_yybjroam05.jpg'} width="50" height="50" />

var v1 = (
    <div key="test" ref="xf" id="fs" onClick="ddfdf">
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
            padding : 10
        }}>
            <h1>nobo({list[0]})</h1>
        </div>
        <ul>
            {
                Neact.utils.map(list,function(v,i){
                    return <li key={v}>{v}</li>;
                })
            }
        </ul>
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
    list.length % 5 === 0 ? v2 : v1
);

}

var lastVNode = getVNodes();

Neact.render(lastVNode, demo);

function patch(){
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

setInterval(function(){
   patch(); 
}, 500)