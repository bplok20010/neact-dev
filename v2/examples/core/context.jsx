/** @jsx Neact.createElement */

var idx = 0;

var Lang = {
    username : '用户名',
    gender: '性别',
    age : '年龄',
    cancel:'取消',
    ok:'确定'
};

class Context extends Neact.Component{
    getChildContext(){
        return Lang;
    }
    render(){
        return <div>{Neact.cloneElement(this.props.children)}</div>;
    }
}

class Tar extends Neact.Component {
    render(){
        var context = this.context;
        console.log(context)
        return (
            <div>
                <div style={{border:''}}>{context['cancel']}</div>
                <div>{context['ok']}</div>
            </div>
        );
    }
}

class UserInfo extends Neact.Component {
    getChildContext(){
        return {
            cancel : '无效'
        };
    }
    render(){
        var state = this.state;
        var context = this.context;
        return state.x ? <a>123456</a> : (
            <div>
                <button onClick={()=>{this.setState({x:1}); console.log(this._vNode)}}>改变</button>
                <div>{context['username']}</div>
                <div>{context['gender']}</div>
                <div>{context['age']}</div>
                <Tar />
            </div>
        );
    }
}

class App extends Neact.Component {
    render(){
        return (
            <UserInfo/>
        );
    }
}


var inst = Neact.render(<Context><App /></Context>, demo);

function change(){
    

    idx++;

    Lang = {
        username : '用户名'+idx,
        gender: '性别'+idx,
        age : '年龄'+idx,
        cancel:'取消'+idx,
        ok:'确定'+idx
    };
    inst.forceUpdate();
}
