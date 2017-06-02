/** @jsx Neact.createElement */

var index = 5;

var Logs = {
    log(){
       // console.log(...arguments)
    }   
};

var list = (function(num){
    var s = []
    for(var i = 1; i<= num;i++) {
        s.push(i);
    }
    return s;
})(index);

var Li = Neact.createClass({
    render(){
        return <li>{this.props.children}</li>;
    }
});

var List = Neact.createClass({
    componentWillMount(){
        this.setState({a:1}, function(){
            Logs.log('List componentWillMount setState(...)');
        });
    },
    componentWillReceiveProps(){
        Logs.log('List componentWillReceiveProps');
        this.setState({b:1}, function(){
            Logs.log('List componentWillReceiveProps setState(...)');
        });
    },
    render(){
       Logs.log(this.state, 'List State');
       return <ul>
           {
               Neact.utils.map(list, function(v,i){
                    return <Li key={v}>{v}</Li>;
               })
           }
       </ul>
    } 
});

var NewList = Neact.createClass({
    componentWillMount(){
        Logs.log('NewList componentWillMount')
        this.setState({a:1}, function(){
            Logs.log('NewList componentWillMount setState(...)');
        });
    },
    componentDidMount(){
        Logs.log('NewList componentDidMount')
    },
    componentWillReceiveProps(){
        Logs.log('NewList componentWillReceiveProps');
        this.setState({b:1}, function(){
            Logs.log('NewList componentWillReceiveProps setState(...)');
        });
    },
    shouldComponentUpdate(){
         Logs.log('NewList shouldComponentUpdate')
        this.setState({b:1}, function(){
            Logs.log('NewList shouldComponentUpdate setState(...)');
        });
    },
    componentWillUpdate(){
    },
    componentDidUpdate(){
    },
    render(){
       Logs.log(this.state, 'NewList State');
       return <List />
    }
});

var App = Neact.createClass({
    componentWillMount(){
        Logs.log('componentWillMount')
    },
    componentDidMount(){
        Logs.log('componentDidMount')
    },
    componentWillReceiveProps(){
        Logs.log('componentWillReceiveProps');
    },
    shouldComponentUpdate(){
        Logs.log('shouldComponentUpdate');
    },
    componentWillUpdate(){
        Logs.log('componentWillUpdate');
    },
    componentDidUpdate(){
        Logs.log('componentDidUpdate');
    },
    render(){
       Logs.log('render');
       return <div>App<NewList /></div>
    }
});

var inst = Neact.render(<App />, demo);

function setState(){
    list.push(++index);
    list.sort(function(){
        return Math.random() - .5;
    });
    //console.clear();
    //console.time(1);
    inst.forceUpdate(function(){
         Logs.log('NewList forceUpdate setState(...)');
     });
    //console.timeEnd(1);
}
