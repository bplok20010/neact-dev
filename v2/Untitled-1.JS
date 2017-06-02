s = {
    mountComponent: function(transaction, hostParent, hostContainerInfo, context) {
        var _this = this;

        this._context = context;
        this._mountOrder = nextMountID++;
        this._hostParent = hostParent;
        this._hostContainerInfo = hostContainerInfo;

        var publicProps = this._currentElement.props;
        var publicContext = this._processContext(context);

        var Component = this._currentElement.type;

        var updateQueue = transaction.getUpdateQueue();

        // Initialize the public class
        var doConstruct = shouldConstruct(Component);
        var inst = this._constructComponent(doConstruct, publicProps, publicContext, updateQueue);
        var renderedElement;

        // Support functional components
        if (!doConstruct && (inst == null || inst.render == null)) {
            renderedElement = inst;
            warnIfInvalidElement(Component, renderedElement);
            !(inst === null || inst === false || React.isValidElement(inst)) ? "development" !== 'production' ? invariant(false, '%s(...): A valid React element (or null) must be returned. You may have returned undefined, an array or some other invalid object.', Component.displayName || Component.name || 'Component'): _prodInvariant('105', Component.displayName || Component.name || 'Component'): void 0;
            inst = new StatelessComponent(Component);
            this._compositeType = CompositeTypes.StatelessFunctional;
        } else {
            if (isPureComponent(Component)) {
                this._compositeType = CompositeTypes.PureClass;
            } else {
                this._compositeType = CompositeTypes.ImpureClass;
            }
        }

        if ("development" !== 'production') {
            // This will throw later in _renderValidatedComponent, but add an early
            // warning now to help debugging
            if (inst.render == null) {
                "development" !== 'production' ? warning(false, '%s(...): No `render` method found on the returned component ' + 'instance: you may have forgotten to define `render`.', Component.displayName || Component.name || 'Component'): void 0;
            }

            var propsMutated = inst.props !== publicProps;
            var componentName = Component.displayName || Component.name || 'Component';

            "development" !== 'production' ? warning(inst.props === undefined || !propsMutated, '%s(...): When calling super() in `%s`, make sure to pass ' + 'up the same props that your component\'s constructor was passed.', componentName, componentName): void 0;
        }

        // These should be set up in the constructor, but as a convenience for
        // simpler class abstractions, we set them up after the fact.
        inst.props = publicProps;
        inst.context = publicContext;
        inst.refs = emptyObject;
        inst.updater = updateQueue;

        this._instance = inst;

        // Store a reference from the instance back to the internal representation
        ReactInstanceMap.set(inst, this);

        if ("development" !== 'production') {
            // Since plain JS classes are defined without any special initialization
            // logic, we can not catch common errors early. Therefore, we have to
            // catch them here, at initialization time, instead.
            "development" !== 'production' ? warning(!inst.getInitialState || inst.getInitialState.isReactClassApproved, 'getInitialState was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Did you mean to define a state property instead?', this.getName() || 'a component'): void 0;
            "development" !== 'production' ? warning(!inst.getDefaultProps || inst.getDefaultProps.isReactClassApproved, 'getDefaultProps was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Use a static property to define defaultProps instead.', this.getName() || 'a component'): void 0;
            "development" !== 'production' ? warning(!inst.propTypes, 'propTypes was defined as an instance property on %s. Use a static ' + 'property to define propTypes instead.', this.getName() || 'a component'): void 0;
            "development" !== 'production' ? warning(!inst.contextTypes, 'contextTypes was defined as an instance property on %s. Use a ' + 'static property to define contextTypes instead.', this.getName() || 'a component'): void 0;
            "development" !== 'production' ? warning(typeof inst.componentShouldUpdate !== 'function', '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', this.getName() || 'A component'): void 0;
            "development" !== 'production' ? warning(typeof inst.componentDidUnmount !== 'function', '%s has a method called ' + 'componentDidUnmount(). But there is no such lifecycle method. ' + 'Did you mean componentWillUnmount()?', this.getName() || 'A component'): void 0;
            "development" !== 'production' ? warning(typeof inst.componentWillRecieveProps !== 'function', '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', this.getName() || 'A component'): void 0;
        }

        var initialState = inst.state;
        if (initialState === undefined) {
            inst.state = initialState = null;
        }!(typeof initialState === 'object' && !Array.isArray(initialState)) ? "development" !== 'production' ? invariant(false, '%s.state: must be set to an object or null', this.getName() || 'ReactCompositeComponent'): _prodInvariant('106', this.getName() || 'ReactCompositeComponent'): void 0;

        this._pendingStateQueue = null;
        this._pendingReplaceState = false;
        this._pendingForceUpdate = false;

        var markup;
        if (inst.unstable_handleError) {
            markup = this.performInitialMountWithErrorHandling(renderedElement, hostParent, hostContainerInfo, transaction, context);
        } else {
            markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
        }

        if (inst.componentDidMount) {
            if ("development" !== 'production') {
                transaction.getReactMountReady().enqueue(function() {
                    measureLifeCyclePerf(function() {
                        return inst.componentDidMount();
                    }, _this._debugID, 'componentDidMount');
                });
            } else {
                transaction.getReactMountReady().enqueue(inst.componentDidMount, inst);
            }
        }

        return markup;
    },

    performInitialMount: function(renderedElement, hostParent, hostContainerInfo, transaction, context) {
        var inst = this._instance;

        var debugID = 0;
        if ("development" !== 'production') {
            debugID = this._debugID;
        }

        if (inst.componentWillMount) {
            if ("development" !== 'production') {
                measureLifeCyclePerf(function() {
                    return inst.componentWillMount();
                }, debugID, 'componentWillMount');
            } else {
                inst.componentWillMount();
            }
            // When mounting, calls to `setState` by `componentWillMount` will set
            // `this._pendingStateQueue` without triggering a re-render.
            if (this._pendingStateQueue) {
                inst.state = this._processPendingState(inst.props, inst.context);
            }
        }

        // If not a stateless component, we now render
        if (renderedElement === undefined) {
            renderedElement = this._renderValidatedComponent();
        }

        var nodeType = ReactNodeTypes.getType(renderedElement);
        this._renderedNodeType = nodeType;
        var child = this._instantiateReactComponent(renderedElement, nodeType !== ReactNodeTypes.EMPTY /* shouldHaveDebugID */ );
        this._renderedComponent = child;

        var markup = ReactReconciler.mountComponent(child, transaction, hostParent, hostContainerInfo, this._processChildContext(context), debugID);

        if ("development" !== 'production') {
            if (debugID !== 0) {
                var childDebugIDs = child._debugID !== 0 ? [child._debugID] : [];
                ReactInstrumentation.debugTool.onSetChildren(debugID, childDebugIDs);
            }
        }

        return markup;
    },

    _processChildContext: function(currentContext) {
        var Component = this._currentElement.type;
        var inst = this._instance;
        var childContext;

        if (inst.getChildContext) {
            if ("development" !== 'production') {
                ReactInstrumentation.debugTool.onBeginProcessingChildContext();
                try {
                    childContext = inst.getChildContext();
                } finally {
                    ReactInstrumentation.debugTool.onEndProcessingChildContext();
                }
            } else {
                childContext = inst.getChildContext();
            }
        }

        if (childContext) {
            !(typeof Component.childContextTypes === 'object') ? "development" !== 'production' ? invariant(false, '%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().', this.getName() || 'ReactCompositeComponent'): _prodInvariant('107', this.getName() || 'ReactCompositeComponent'): void 0;
            if ("development" !== 'production') {
                this._checkContextTypes(Component.childContextTypes, childContext, 'childContext');
            }
            for (var name in childContext) {
                !(name in Component.childContextTypes) ? "development" !== 'production' ? invariant(false, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', this.getName() || 'ReactCompositeComponent', name): _prodInvariant('108', this.getName() || 'ReactCompositeComponent', name): void 0;
            }
            return _assign({}, currentContext, childContext);
        }
        return currentContext;
    },

    _processPendingState: function(props, context) {
        var inst = this._instance;
        var queue = this._pendingStateQueue;
        var replace = this._pendingReplaceState;
        this._pendingReplaceState = false;
        this._pendingStateQueue = null;

        if (!queue) {
            return inst.state;
        }

        if (replace && queue.length === 1) {
            return queue[0];
        }

        var nextState = _assign({}, replace ? queue[0] : inst.state);
        for (var i = replace ? 1 : 0; i < queue.length; i++) {
            var partial = queue[i];
            _assign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
        }

        return nextState;
    },

    enqueueSetState: function(publicInstance, partialState) {
        if ("development" !== 'production') {
            ReactInstrumentation.debugTool.onSetState();
            "development" !== 'production' ? warning(partialState != null, 'setState(...): You passed an undefined or null state object; ' + 'instead, use forceUpdate().'): void 0;
        }

        var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');

        if (!internalInstance) {
            return;
        }

        var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
        queue.push(partialState);

        enqueueUpdate(internalInstance);
    },

    updateComponent: function(transaction, prevParentElement, nextParentElement, prevUnmaskedContext, nextUnmaskedContext) {
        var inst = this._instance;
        !(inst != null) ? "development" !== 'production' ? invariant(false, 'Attempted to update component `%s` that has already been unmounted (or failed to mount).', this.getName() || 'ReactCompositeComponent'): _prodInvariant('136', this.getName() || 'ReactCompositeComponent'): void 0;

        var willReceive = false;
        var nextContext;

        // Determine if the context has changed or not
        if (this._context === nextUnmaskedContext) {
            nextContext = inst.context;
        } else {
            nextContext = this._processContext(nextUnmaskedContext);
            willReceive = true;
        }

        var prevProps = prevParentElement.props;
        var nextProps = nextParentElement.props;

        // Not a simple state update but a props update
        if (prevParentElement !== nextParentElement) {
            willReceive = true;
        }

        // An update here will schedule an update but immediately set
        // _pendingStateQueue which will ensure that any state updates gets
        // immediately reconciled instead of waiting for the next batch.
        if (willReceive && inst.componentWillReceiveProps) {
            if ("development" !== 'production') {
                measureLifeCyclePerf(function() {
                    return inst.componentWillReceiveProps(nextProps, nextContext);
                }, this._debugID, 'componentWillReceiveProps');
            } else {
                inst.componentWillReceiveProps(nextProps, nextContext);
            }
        }

        var nextState = this._processPendingState(nextProps, nextContext);
        var shouldUpdate = true;

        if (!this._pendingForceUpdate) {
            if (inst.shouldComponentUpdate) {
                if ("development" !== 'production') {
                    shouldUpdate = measureLifeCyclePerf(function() {
                        return inst.shouldComponentUpdate(nextProps, nextState, nextContext);
                    }, this._debugID, 'shouldComponentUpdate');
                } else {
                    shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState, nextContext);
                }
            } else {
                if (this._compositeType === CompositeTypes.PureClass) {
                    shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState);
                }
            }
        }

        if ("development" !== 'production') {
            "development" !== 'production' ? warning(shouldUpdate !== undefined, '%s.shouldComponentUpdate(): Returned undefined instead of a ' + 'boolean value. Make sure to return true or false.', this.getName() || 'ReactCompositeComponent'): void 0;
        }

        this._updateBatchNumber = null;
        if (shouldUpdate) {
            this._pendingForceUpdate = false;
            // Will set `this.props`, `this.state` and `this.context`.
            this._performComponentUpdate(nextParentElement, nextProps, nextState, nextContext, transaction, nextUnmaskedContext);
        } else {
            // If it's determined that a component should not update, we still want
            // to set props and state but we shortcut the rest of the update.
            this._currentElement = nextParentElement;
            this._context = nextUnmaskedContext;
            inst.props = nextProps;
            inst.state = nextState;
            inst.context = nextContext;
        }
    },

    _processPendingState: function(props, context) {
        var inst = this._instance;
        var queue = this._pendingStateQueue;
        var replace = this._pendingReplaceState;
        this._pendingReplaceState = false;
        this._pendingStateQueue = null;

        if (!queue) {
            return inst.state;
        }

        if (replace && queue.length === 1) {
            return queue[0];
        }

        var nextState = _assign({}, replace ? queue[0] : inst.state);
        for (var i = replace ? 1 : 0; i < queue.length; i++) {
            var partial = queue[i];
            _assign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
        }

        return nextState;
    },

    /**
     * Merges new props and state, notifies delegate methods of update and
     * performs update.
     *
     * @param {ReactElement} nextElement Next element
     * @param {object} nextProps Next public object to set as properties.
     * @param {?object} nextState Next object to set as state.
     * @param {?object} nextContext Next public object to set as context.
     * @param {ReactReconcileTransaction} transaction
     * @param {?object} unmaskedContext
     * @private
     */
    _performComponentUpdate: function(nextElement, nextProps, nextState, nextContext, transaction, unmaskedContext) {
        var _this2 = this;

        var inst = this._instance;

        var hasComponentDidUpdate = Boolean(inst.componentDidUpdate);
        var prevProps;
        var prevState;
        var prevContext;
        if (hasComponentDidUpdate) {
            prevProps = inst.props;
            prevState = inst.state;
            prevContext = inst.context;
        }

        if (inst.componentWillUpdate) {
            if ("development" !== 'production') {
                measureLifeCyclePerf(function() {
                    return inst.componentWillUpdate(nextProps, nextState, nextContext);
                }, this._debugID, 'componentWillUpdate');
            } else {
                inst.componentWillUpdate(nextProps, nextState, nextContext);
            }
        }

        this._currentElement = nextElement;
        this._context = unmaskedContext;
        inst.props = nextProps;
        inst.state = nextState;
        inst.context = nextContext;

        this._updateRenderedComponent(transaction, unmaskedContext);

        if (hasComponentDidUpdate) {
            if ("development" !== 'production') {
                transaction.getReactMountReady().enqueue(function() {
                    measureLifeCyclePerf(inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext), _this2._debugID, 'componentDidUpdate');
                });
            } else {
                transaction.getReactMountReady().enqueue(inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext), inst);
            }
        }
    },

    /**
     * Call the component's `render` method and update the DOM accordingly.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    _updateRenderedComponent: function(transaction, context) {
        var prevComponentInstance = this._renderedComponent;
        var prevRenderedElement = prevComponentInstance._currentElement;
        var nextRenderedElement = this._renderValidatedComponent();

        var debugID = 0;
        if ("development" !== 'production') {
            debugID = this._debugID;
        }

        if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
            ReactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement, transaction, this._processChildContext(context));
        } else {
            var oldHostNode = ReactReconciler.getHostNode(prevComponentInstance);
            ReactReconciler.unmountComponent(prevComponentInstance, false);

            var nodeType = ReactNodeTypes.getType(nextRenderedElement);
            this._renderedNodeType = nodeType;
            var child = this._instantiateReactComponent(nextRenderedElement, nodeType !== ReactNodeTypes.EMPTY /* shouldHaveDebugID */ );
            this._renderedComponent = child;

            var nextMarkup = ReactReconciler.mountComponent(child, transaction, this._hostParent, this._hostContainerInfo, this._processChildContext(context), debugID);

            if ("development" !== 'production') {
                if (debugID !== 0) {
                    var childDebugIDs = child._debugID !== 0 ? [child._debugID] : [];
                    ReactInstrumentation.debugTool.onSetChildren(debugID, childDebugIDs);
                }
            }

            this._replaceNodeWithMarkup(oldHostNode, nextMarkup, prevComponentInstance);
        }
    },

    /**
     * Update a component using a new element.
     *
     * @param {ReactComponent} internalInstance
     * @param {ReactElement} nextElement
     * @param {ReactReconcileTransaction} transaction
     * @param {object} context
     * @internal
     */
    receiveComponent: function(internalInstance, nextElement, transaction, context) {
        var prevElement = internalInstance._currentElement;

        if (nextElement === prevElement && context === internalInstance._context) {
            // Since elements are immutable after the owner is rendered,
            // we can do a cheap identity compare here to determine if this is a
            // superfluous reconcile. It's possible for state to be mutable but such
            // change should trigger an update of the owner which would recreate
            // the element. We explicitly check for the existence of an owner since
            // it's possible for an element created outside a composite to be
            // deeply mutated and reused.

            // TODO: Bailing out early is just a perf optimization right?
            // TODO: Removing the return statement should affect correctness?
            return;
        }

        if ("development" !== 'production') {
            if (internalInstance._debugID !== 0) {
                ReactInstrumentation.debugTool.onBeforeUpdateComponent(internalInstance._debugID, nextElement);
            }
        }

        var refsChanged = ReactRef.shouldUpdateRefs(prevElement, nextElement);

        if (refsChanged) {
            ReactRef.detachRefs(internalInstance, prevElement);
        }

        internalInstance.receiveComponent(nextElement, transaction, context);

        if (refsChanged && internalInstance._currentElement && internalInstance._currentElement.ref != null) {
            transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
        }

        if ("development" !== 'production') {
            if (internalInstance._debugID !== 0) {
                ReactInstrumentation.debugTool.onUpdateComponent(internalInstance._debugID);
            }
        }
    },

    receiveComponent: function(nextElement, transaction, nextContext) {
        var prevElement = this._currentElement;
        var prevContext = this._context;

        this._pendingElement = null;

        this.updateComponent(transaction, prevElement, nextElement, prevContext, nextContext);
    },
    /**
     * Overridden in shallow rendering.
     *
     * @protected
     */
    _replaceNodeWithMarkup: function(oldHostNode, nextMarkup, prevInstance) {
        ReactComponentEnvironment.replaceNodeWithMarkup(oldHostNode, nextMarkup, prevInstance);
    },

    /**
     * @protected
     */
    _renderValidatedComponentWithoutOwnerOrContext: function() {
        var inst = this._instance;
        var renderedElement;

        if ("development" !== 'production') {
            renderedElement = measureLifeCyclePerf(function() {
                return inst.render();
            }, this._debugID, 'render');
        } else {
            renderedElement = inst.render();
        }

        if ("development" !== 'production') {
            // We allow auto-mocks to proceed as if they're returning null.
            if (renderedElement === undefined && inst.render._isMockFunction) {
                // This is probably bad practice. Consider warning here and
                // deprecating this convenience.
                renderedElement = null;
            }
        }

        return renderedElement;
    },
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {

    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function(publicInstance) {
        return false;
    },

    /**
     * Enqueue a callback that will be executed after all the pending updates
     * have processed.
     *
     * @param {ReactClass} publicInstance The instance to use as `this` context.
     * @param {?function} callback Called after state is updated.
     * @internal
     */
    enqueueCallback: function(publicInstance, callback) {},

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @internal
     */
    enqueueForceUpdate: function(publicInstance) {
        warnNoop(publicInstance, 'forceUpdate');
    },

    /**
     * Replaces all of the state. Always use this or `setState` to mutate state.
     * You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} completeState Next state.
     * @internal
     */
    enqueueReplaceState: function(publicInstance, completeState) {
        warnNoop(publicInstance, 'replaceState');
    },

    /**
     * Sets a subset of the state. This only exists because _pendingState is
     * internal. This provides a merging strategy that is not available to deep
     * properties which is confusing. TODO: Expose pendingState or don't use it
     * during the merge.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} partialState Next partial state to be merged with state.
     * @internal
     */
    enqueueSetState: function(publicInstance, partialState) {
        warnNoop(publicInstance, 'setState');
    }
};