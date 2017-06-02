'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx Neact.createElement */

var idx = 0;

var Lang = {
    username: '用户名',
    gender: '性别',
    age: '年龄',
    cancel: '取消',
    ok: '确定'
};

var Context = function (_Neact$Component) {
    _inherits(Context, _Neact$Component);

    function Context() {
        _classCallCheck(this, Context);

        return _possibleConstructorReturn(this, (Context.__proto__ || Object.getPrototypeOf(Context)).apply(this, arguments));
    }

    _createClass(Context, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return Lang;
        }
    }, {
        key: 'render',
        value: function render() {
            return Neact.createElement(
                'div',
                null,
                Neact.cloneElement(this.props.children)
            );
        }
    }]);

    return Context;
}(Neact.Component);

var Tar = function (_Neact$Component2) {
    _inherits(Tar, _Neact$Component2);

    function Tar() {
        _classCallCheck(this, Tar);

        return _possibleConstructorReturn(this, (Tar.__proto__ || Object.getPrototypeOf(Tar)).apply(this, arguments));
    }

    _createClass(Tar, [{
        key: 'render',
        value: function render() {
            var context = this.context;
            console.log(context);
            return Neact.createElement(
                'div',
                null,
                Neact.createElement(
                    'div',
                    { style: { border: '' } },
                    context['cancel']
                ),
                Neact.createElement(
                    'div',
                    null,
                    context['ok']
                )
            );
        }
    }]);

    return Tar;
}(Neact.Component);

var UserInfo = function (_Neact$Component3) {
    _inherits(UserInfo, _Neact$Component3);

    function UserInfo() {
        _classCallCheck(this, UserInfo);

        return _possibleConstructorReturn(this, (UserInfo.__proto__ || Object.getPrototypeOf(UserInfo)).apply(this, arguments));
    }

    _createClass(UserInfo, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                cancel: '无效'
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var state = this.state;
            var context = this.context;
            return state.x ? Neact.createElement(
                'a',
                null,
                '123456'
            ) : Neact.createElement(
                'div',
                null,
                Neact.createElement(
                    'button',
                    { onClick: function () {
                            _this4.setState({ x: 1 });console.log(_this4._vNode);
                        } },
                    '\u6539\u53D8'
                ),
                Neact.createElement(
                    'div',
                    null,
                    context['username']
                ),
                Neact.createElement(
                    'div',
                    null,
                    context['gender']
                ),
                Neact.createElement(
                    'div',
                    null,
                    context['age']
                ),
                Neact.createElement(Tar, null)
            );
        }
    }]);

    return UserInfo;
}(Neact.Component);

var App = function (_Neact$Component4) {
    _inherits(App, _Neact$Component4);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return Neact.createElement(UserInfo, null);
        }
    }]);

    return App;
}(Neact.Component);

var inst = Neact.render(Neact.createElement(
    Context,
    null,
    Neact.createElement(App, null)
), demo);

function change() {

    idx++;

    Lang = {
        username: '用户名' + idx,
        gender: '性别' + idx,
        age: '年龄' + idx,
        cancel: '取消' + idx,
        ok: '确定' + idx
    };
    inst.forceUpdate();
}