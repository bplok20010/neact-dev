'use strict';

/** @jsx Neact.createElement */

var index = 5;

var Logs = {
    log: function () {
        // console.log(...arguments)
    }
};

var list = function (num) {
    var s = [];
    for (var i = 1; i <= num; i++) {
        s.push(i);
    }
    return s;
}(index);

var Li = Neact.createClass({
    render: function () {
        return Neact.createElement(
            'li',
            null,
            this.props.children
        );
    }
});

var List = Neact.createClass({
    componentWillMount: function () {
        this.setState({ a: 1 }, function () {
            Logs.log('List componentWillMount setState(...)');
        });
    },
    componentWillReceiveProps: function () {
        Logs.log('List componentWillReceiveProps');
        this.setState({ b: 1 }, function () {
            Logs.log('List componentWillReceiveProps setState(...)');
        });
    },
    render: function () {
        Logs.log(this.state, 'List State');
        return Neact.createElement(
            'ul',
            null,
            Neact.utils.map(list, function (v, i) {
                return Neact.createElement(
                    Li,
                    { key: v },
                    v
                );
            })
        );
    }
});

var NewList = Neact.createClass({
    componentWillMount: function () {
        Logs.log('NewList componentWillMount');
        this.setState({ a: 1 }, function () {
            Logs.log('NewList componentWillMount setState(...)');
        });
    },
    componentDidMount: function () {
        Logs.log('NewList componentDidMount');
    },
    componentWillReceiveProps: function () {
        Logs.log('NewList componentWillReceiveProps');
        this.setState({ b: 1 }, function () {
            Logs.log('NewList componentWillReceiveProps setState(...)');
        });
    },
    shouldComponentUpdate: function () {
        Logs.log('NewList shouldComponentUpdate');
        this.setState({ b: 1 }, function () {
            Logs.log('NewList shouldComponentUpdate setState(...)');
        });
    },
    componentWillUpdate: function () {},
    componentDidUpdate: function () {},
    render: function () {
        Logs.log(this.state, 'NewList State');
        return Neact.createElement(List, null);
    }
});

var App = Neact.createClass({
    componentWillMount: function () {
        Logs.log('componentWillMount');
    },
    componentDidMount: function () {
        Logs.log('componentDidMount');
    },
    componentWillReceiveProps: function () {
        Logs.log('componentWillReceiveProps');
    },
    shouldComponentUpdate: function () {
        Logs.log('shouldComponentUpdate');
    },
    componentWillUpdate: function () {
        Logs.log('componentWillUpdate');
    },
    componentDidUpdate: function () {
        Logs.log('componentDidUpdate');
    },
    render: function () {
        Logs.log('render');
        return Neact.createElement(
            'div',
            null,
            'App',
            Neact.createElement(NewList, null)
        );
    }
});

var inst = Neact.render(Neact.createElement(App, null), demo);

function setState() {
    list.push(++index);
    list.sort(function () {
        return Math.random() - .5;
    });
    //console.clear();
    //console.time(1);
    inst.forceUpdate(function () {
        Logs.log('NewList forceUpdate setState(...)');
    });
    //console.timeEnd(1);
}