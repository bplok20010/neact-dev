var assert = require('assert');

var h = Neact.createElement;

var Logs = {
    queue: [],
    equal: function(ret) {
        var queue = this.queue;
        assert.strictEqual(queue.length, ret.length);
        if (queue.length === ret.length) {
            for (var i = 0; i < queue.length; i++) {
                assert.strictEqual(queue[i], ret[i]);
            }
        } else {}
        queue.length = 0;
    },
    log: function() {
        var queue = this.queue;
        queue.push.apply(queue, arguments);
    }
};

var App = Neact.createClass({
    componentWillMount: function componentWillMount() {
        Logs.log('componentWillMount');
    },
    componentDidMount: function componentDidMount() {
        Logs.log('componentDidMount');
    },
    componentWillReceiveProps: function componentWillReceiveProps() {
        Logs.log('componentWillReceiveProps');
    },
    shouldComponentUpdate: function shouldComponentUpdate() {
        Logs.log('shouldComponentUpdate');
    },
    componentWillUpdate: function componentWillUpdate() {
        Logs.log('componentWillUpdate');
    },
    componentDidUpdate: function componentDidUpdate() {
        Logs.log('componentDidUpdate');

    },
    render: function render() {
        Logs.log('render');
        return Neact.createElement(
            'div',
            null,
            'App'
        );
    }
});

var WrapNode = Neact.createClass({
    shouldComponentUpdate: function shouldComponentUpdate() {
        return WrapNode.shouldUpdate;
    },
    render: function() {
        return h(App);
    }
});

describe('ClassComponent Lifecycle', function() {
    var dom = document.createElement('div');
    var inst = Neact.render(h(App), dom);

    it('Neact.render(...)', function() {
        Logs.equal([
            'componentWillMount',
            'render',
            'componentDidMount'
        ]);
    });
    it('setState(...)', function() {
        inst.setState({ a: 1 }, function() {
            Logs.log('setState');
        });
        Logs.equal([
            'shouldComponentUpdate',
            'componentWillUpdate',
            'render',
            'componentDidUpdate',
            'setState'
        ]);
    });
    it('forceUpdate(...)', function() {
        inst.forceUpdate(function() {
            Logs.log('forceUpdate');
        });
        Logs.equal([
            'componentWillUpdate',
            'render',
            'componentDidUpdate',
            'forceUpdate'
        ]);
    });

    it('Lifecycle Children', function() {
        var dom = document.createElement('div');
        var inst = Neact.render(h(WrapNode), dom);
        Logs.equal([
            'componentWillMount',
            'render',
            'componentDidMount'
        ]);

        inst.setState({ a: 1 }, function() {
            Logs.log('setState');
        });
        Logs.equal([
            'componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'render',
            'componentDidUpdate',
            'setState'
        ]);

        inst.forceUpdate(function() {
            Logs.log('forceUpdate');
        });
        Logs.equal([
            'componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'render',
            'componentDidUpdate',
            'forceUpdate'
        ]);

        WrapNode.shouldUpdate = false;
        inst.forceUpdate(function() {
            Logs.log('forceUpdate');
        });
        Logs.equal([
            'componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'render',
            'componentDidUpdate',
            'forceUpdate'
        ]);
        inst.setState({ a: 1 }, function() {
            Logs.log('setState');
        });
        Logs.equal([
            'setState'
        ]);
        WrapNode.shouldUpdate = true;

    });
});