"use strict";

/** @jsx Neact.createElement */

var THead = Neact.createClass({
    getDefaultProps: function getDefaultProps() {
        return {
            columns: []
        };
    },

    render: function render() {
        var columns = this.props.columns;

        return Neact.createElement(
            "thead",
            null,
            Neact.createElement(
                "tr",
                null,
                Neact.createElement(
                    "th",
                    { width: "40", "class": "h" },
                    "#"
                ),
                Neact.util.map(columns, function (data) {
                    return Neact.createElement(
                        "th",
                        { "class": data.hcls },
                        data.title
                    );
                })
            )
        );
    }
});

var TBody = Neact.createClass({
    getDefaultProps: function getDefaultProps() {
        return {
            columns: [],
            data: []
        };
    },

    addData: function addData() {
        var props = this.props;
        if (props.onAddData) {
            props.onAddData();
        }
    },

    deleteData: function deleteData() {
        var props = this.props;
        if (props.onRemoveData && this.selectIdx !== null) {
            props.onRemoveData(this.selectIdx);
        }
    },

    shouldComponentUpdate: function shouldComponentUpdate() {},

    componentWillMount: function componentWillMount() {

        this.selectIdx = null;
    },

    render: function render() {
        var _this = this;

        var self = this;
        var columns = this.props.columns;
        var data = this.props.data;
        return Neact.createElement(
            "tbody",
            { tabIndex: "0", onKeyDown: function onKeyDown(e) {
                    //UP 38 DOWN 40
                    if (!data.length) return;
                    if (self.selectIdx === null) {
                        self.selectIdx = 0;
                    } else if (e.keyCode == 38) {
                        self.selectIdx = Math.max(0, --self.selectIdx);
                    } else if (e.keyCode == 40) {
                        self.selectIdx = Math.min(data.length - 1, ++self.selectIdx);
                    }

                    e.preventDefault();

                    self.setState(null);
                } },
            Neact.createElement(
                "tr",
                null,
                Neact.createElement(
                    "td",
                    { colspan: columns.length + 1 },
                    Neact.createElement(
                        "button",
                        { onClick: function onClick(e) {
                                return _this.addData();
                            } },
                        "\u65B0\u589E"
                    ),
                    Neact.createElement(
                        "button",
                        { disabled: !data.length || self.selectIdx === null, onClick: function onClick(e) {
                                return _this.deleteData();
                            } },
                        "\u5220\u9664"
                    )
                )
            ),
            Neact.util.map(data, function (rowData, i) {
                var isSelected = false;
                if (i === self.selectIdx) {
                    isSelected = true;
                }

                var v = [];

                var $row = Neact.createElement(
                    "tr",
                    { onClick: function onClick() {
                            self.selectIdx = i;
                            self.setState(null);
                        }, className: isSelected ? 'selected' : '' },
                    Neact.createElement(
                        "td",
                        { "class": "b" },
                        Neact.createElement("input", { type: "checkbox", checked: isSelected ? 'checked' : '' })
                    ),
                    Neact.util.map(columns, function (column) {
                        return Neact.createElement(
                            "td",
                            { "class": column.bcls },
                            rowData[column.field]
                        );
                    })
                );

                v.push($row);

                if (isSelected) {
                    v.push(Neact.createElement(
                        "tr",
                        { key: "_expand" },
                        Neact.createElement(
                            "td",
                            { colspan: columns.length + 1 },
                            Neact.createElement(
                                "div",
                                null,
                                "ID : ",
                                rowData.id
                            ),
                            Neact.createElement(
                                "div",
                                null,
                                "NAME : ",
                                rowData.name
                            ),
                            Neact.createElement(
                                "div",
                                null,
                                "AGE : ",
                                rowData.age
                            )
                        )
                    ));
                }

                return v;
            })
        );
    }
});

var Table = Neact.createClass({

    construct: function construct(props) {
        this.state = {
            columns: props.columns || [],
            data: props.data || []
        };
    },

    addData: function addData() {
        var data = this.state.data;

        data.push({
            id: data.length,
            name: 'nobo' + data.length,
            age: 19
        });

        this.setState({
            data: data
        });
    },

    removeData: function removeData(idx) {
        var data = this.state.data;
        data.splice(idx, 1);
        this.setState({
            data: data
        });
    },

    render: function render() {
        var _this2 = this;

        var columns = this.state.columns;
        var data = this.state.data;

        return Neact.createElement(
            "table",
            { style: "width:500px;border-collapse:collapse;table-layout:fixed;", cellpadding: "0", cellspacing: "0" },
            Neact.createElement(THead, { columns: columns }),
            Neact.createElement(TBody, {
                columns: columns,
                data: data,
                onAddData: function onAddData() {
                    return _this2.addData();
                },
                onRemoveData: function onRemoveData(idx) {
                    return _this2.removeData(idx);
                }
            })
        );
    }
});

var columns = [{
    hcls: 'h',
    bcls: 'b',
    field: 'id',
    title: 'ID'
}, {
    hcls: 'h',
    bcls: 'b',
    field: 'name',
    title: '名称'
}, {
    hcls: 'h',
    bcls: 'b',
    field: 'age',
    title: '年龄'
}];
var data = [{ id: 1, name: 'nobo1', age: '18' }, { id: 2, name: 'nobo2', age: '18' }, { id: 3, name: 'nobo3', age: '18' }, { id: 4, name: 'nobo4', age: '18' }, { id: 5, name: 'nobo5', age: '18' }, { id: 6, name: 'nobo6', age: '18' }, { id: 7, name: 'nobo7', age: '18' }, { id: 8, name: 'nobo8', age: '18' }, { id: 9, name: 'nobo9', age: '18' }];

Neact.render(Neact.createElement(Table, { columns: columns, data: data }), demo);