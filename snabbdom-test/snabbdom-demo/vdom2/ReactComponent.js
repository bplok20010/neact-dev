var updater = require('./patch')
    /**
     * Base class helpers for the updating state of a component.
     */
function ReactComponent(props, context) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    // We initialize the default updater but the real one gets injected by the
    // renderer.
    //this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.$isReactComponent = true;

ReactComponent.prototype.setState = function(partialState, callback) {};
/**
 * @param {Function} callback 
 * 触发重绘机制
 */
ReactComponent.prototype.forceUpdate = function(callback) {
    var self = this;
    //var parentDOM = this._instance.getParentDOM();
    setTimeout(function() {
        //自定义组件返回的必定不是数组所以这里用patchVnode
        updater.patchVnode(self._instance, self._instance._currentElement, []);
    }, 0);
}
module.exports = ReactComponent;