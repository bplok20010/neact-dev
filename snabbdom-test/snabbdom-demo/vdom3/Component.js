//var updater = require('./patch')

function Component(props, context) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
}

Component.prototype.setState = function(partialState, callback) {};
/**
 * @param {Function} callback 
 * 触发重绘机制
 */
Component.prototype.forceUpdate = function(callback) {
    var self = this;
    //var parentDOM = this._instance.getParentDOM();
    setTimeout(function() {
        //自定义组件返回的必定不是数组所以这里用patchVnode
        updater.patchVnode(self._instance, self._instance._currentElement, []);
    }, 0);
}

module.exports = Component;