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

ReactComponent.prototype.forceUpdate = function(callback) {

};

module.exports = ReactComponent;