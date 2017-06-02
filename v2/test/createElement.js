var assert = require('assert');

var h = Neact.createElement;


describe('hyperscript', function() {
    it('check vnode.type', function() {
        assert.equal(h('div').type, 'div');
        assert.equal(h('a').type, 'a');
    });
    it('check vnode.children', function() {
        var vnode = h('div', null, [h('span'), h('b')]);
        assert.equal(vnode.type, 'div');
        assert.equal(vnode.children[0].type, 'span');
        assert.equal(vnode.children[1].type, 'b');
    });
    it('check vnode.children and props.children', function() {
        var vnode = h('div', {
            id: 't'
        }, 'a', 'b', 'c');
        assert.equal(vnode.props.children, undefined);
        assert.equal(vnode.children.length, 3);

        //component
        var vnode = h(h, {
            id: 't'
        }, 'a', 'b', 'c');
        assert.equal(vnode.props.id, 't');
        assert.equal(vnode.props.children.length, 3);
        assert.equal(vnode.children, null);
        var vnode = h(h, {
            id: 't'
        }, null);
        assert.equal(vnode.props.children, null);
    });
    it('can create vnode with null invaild children', function() {
        var vnode = h('div', null, [h('span'), h('b')], null, h('a'), 'nobo', false, [h('div'), h('p'), [h(h)]]);
        assert.equal(vnode.children.length, 7);
        assert.equal(vnode.children[5].type, 'p');
    });
    it('can create vnode with text content', function() {
        var vnode = h('a', null, ['I am a string']);
        assert.equal(vnode.children.children, 'I am a string');
        var vnode = h('a', null, 'I am a string');
        assert.equal(vnode.children.children, 'I am a string');
        var vnode = h('a', {}, 'I am a string', ' ', 'df', null);
        assert.equal(vnode.children.length, 3);
    });
});