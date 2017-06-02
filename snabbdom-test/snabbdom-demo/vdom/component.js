module.exports = function(obj) {
    if (!obj || !obj.render) throw new TypeError('render not exists!');
    var component = function(data) {
        this.data = data;
        this.name = obj.name
        this.props = {
            children : data.children
        }
    }
    component.$name = obj.name;
    component.prototype.$vcomponent = true;
    component.prototype.render = obj.render;
    return component;
}