var is = require('./is');
var ReactComponent = require('./ReactComponent');


function merge(target, source){
    for (name in source) {
      if (source.hasOwnProperty(name)) {
	      target[name] = source[name];
      }
    }
}

function ReactClassComponent(){}

merge( ReactClassComponent.prototype, ReactComponent.prototype );

merge({

  /**
   * TODO: This will be deprecated because state should always keep a consistent
   * type signature and the only use case for this, is to avoid that.
   */
  replaceState: function (newState, callback) {
    this.updater.enqueueReplaceState(this, newState);
    if (callback) {
      this.updater.enqueueCallback(this, callback, 'replaceState');
    }
  },

  /**
   * Checks whether or not this composite component is mounted.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function () {
    
  }
});

/**
 * 
 * 
 */
var ReactClass = {
    createClass : function(spec){
        function Constructor(props, context) {
            this.props = props;
            this.state = null;

            var initialState = this.getInitialState ? this.getInitialState() : null;
            
            if(!(typeof initialState === 'object' && !is.array(initialState))) {
                new TypeError('getInitialState(): must return an object or null');
            }

            this.state = initialState;
        }

        Constructor.prototype = new ReactClassComponent();
        Constructor.prototype.constructor = Constructor;

        merge(Constructor.prototype, spec);

        if (Constructor.getDefaultProps) {
          Constructor.defaultProps = Constructor.getDefaultProps();
        }

        if(!Constructor.prototype.render) {
            new TypeError('createClass(...): Class specification must implement a `render` method.');
        }

        return Constructor;
    }
};

module.exports = ReactClass;