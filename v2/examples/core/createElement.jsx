/** @jsx Neact.createElement */

function MyApp(props){
    return props.children;
}

var h = Neact.createElement;

MyApp.defaultProps = {
    name : 'nobo',
    x:1
}

var vnode = (
    <div key="test" ref="xf" id="fs" onClick={()=>alert(4)}>
        你是谁?
        {null}
        'nishi'
        {
            [
                <a>href1</a>,
                <a>href2</a>
            ]
        }
        <div mid="3" style={{
            border : '1px solid red',
            padding : 10
        }}>
            <h1>nobo</h1>
        </div>
        <i></i>
        <svg width="100%" height="500">
            <path d="M250 150 L150 350 L350 350 Z" />
        </svg>
        <MyApp x="2" onClick="f">
            <div>
                <h1>nobo</h1>
            </div>
        </MyApp>
    </div>
);

console.log(vnode);

Neact.render(vnode, demo);