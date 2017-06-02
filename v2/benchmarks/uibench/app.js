(function() {
    "use strict";

    /* (flags, type, props, children, key, ref, noNormalise) */
    var createVNode = Neact.createVNode;
    var createTextVNode = Neact.createTextVNode
        // var linkEvent = Inferno.linkEvent;

    uibench.init('Neact', '1.0.7 *dev*');

    var treeLeafProps = { className: 'TreeLeaf' };

    function TreeLeaf(data) {
        return createVNode('li', treeLeafProps, data.children + '');
    }

    var shouldDataUpdate = {
        onComponentShouldUpdate: function(lastProps, nextProps) {
            return lastProps !== nextProps;
        }
    };
    var treeNodeProps = { className: 'TreeNode' };

    function TreeNode(data) {
        var length = data.children.length;
        var children = new Array(length);

        for (var i = 0; i < length; i++) {
            var n = data.children[i];
            console.log(n)
            if (n.container) {
                children[i] = createVNode(TreeNode, null, n);
            } else {
                children[i] = createVNode(TreeLeaf, null, n);
            }
        }
        return createVNode('ul', treeNodeProps, children);
    }

    var treeProps = { className: 'Tree' };
    var lastTreeData;

    function tree(data) {
        if (data === lastTreeData) {
            return Inferno.NO_OP;
        }
        lastTreeData = data;
        return createVNode('div', treeProps, createVNode(TreeNode, data.root));
    }

    function AnimBox(data) {
        var time = data.time;
        var style = 'border-radius:' + (time % 10) + 'px;' +
            'background:rgba(0,0,0,' + (0.5 + ((time % 10) / 10)) + ')';

        return createVNode('div', { className: 'AnimBox', style: style, 'data-id': data.id });
    }

    var animProps = { className: 'Anim' };
    var lastAnimData;

    function anim(data) {
        if (data === lastAnimData) {
            return Inferno.NO_OP;
        }
        lastAnimData = data;
        var items = data.items;
        var length = items.length;
        var children = new Array(length);

        for (var i = 0; i < length; i++) {
            var item = items[i];

            children[i] = createVNode(AnimBox, item);
        }
        return createVNode('div', animProps, children);
    }

    function onClick(text, e) {
        console.log('Clicked', text);
        e.stopPropagation();
    }

    var tableCellProps = { className: 'TableCell' };

    function TableCell(props) {
        return createVNode('td', tableCellProps, props.children);
    }

    function TableRow(data) {
        var classes = 'TableRow';

        if (data.active) {
            classes = 'TableRow active';
        }
        var cells = data.props;
        var length = cells.length + 1;
        var children = new Array(length);

        children[0] = createVNode(TableCell, { id: data.id });

        for (var i = 1; i < length; i++) {
            children[i] = createVNode(TableCell, {}, cells[i - 1]);
        }

        return createVNode('tr', { className: classes, 'data-id': data.id }, children);
    }

    var tableProps = { className: 'Table' };
    var lastTableData;

    function table(data) {
        if (data === lastTableData) {
            return Neact.createTextVNode('3');
        }
        lastTableData = data;
        var items = data.items;
        var length = items.length;
        var children = new Array(length);

        for (var i = 0; i < length; i++) {
            var item = items[i];
            children[i] = createVNode(TableRow, item);
        }

        return createVNode('table', tableProps, children);
    }

    var mainProps = { className: 'Main' };
    var lastMainData;

    function main(data) {
        if (data === lastMainData) {
            return Neact.createTextVNode('ui');
        }
        lastMainData = data;
        var location = data.location;
        var section;

        if (location === 'table') {
            section = table(data.table);
        } else if (location === 'anim') {
            section = anim(data.anim);
        } else if (location === 'tree') {
            section = tree(data.tree);
        }

        return createVNode('div', mainProps, section);
    }

    var m = false;

    document.addEventListener('DOMContentLoaded', function(e) {
        var container = document.querySelector('#App');
        uibench.run(
            function(state) {
                if (m) return;
                Neact.render(main(state), container);
                m = true;
            },
            function(samples) {
                Neact.render(
                    createVNode('pre', null, JSON.stringify(samples, null, ' ')), container
                );
            }
        );
    });
})();