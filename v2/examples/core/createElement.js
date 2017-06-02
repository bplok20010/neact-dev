"use strict";

/** @jsx Neact.createElement */

function MyApp(props) {
    return props.children;
}

var h = Neact.createElement;

MyApp.defaultProps = {
    name: 'nobo',
    x: 1
};

var vnode = Neact.createElement(
    "div",
    { key: "test", ref: "xf", id: "fs", onClick: function () {
            return alert(4);
        } },
    "\u4F60\u662F\u8C01?",
    null,
    "'nishi'",
    [Neact.createElement(
        "a",
        null,
        "href1"
    ), Neact.createElement(
        "a",
        null,
        "href2"
    )],
    Neact.createElement(
        "div",
        { mid: "3", style: {
                border: '1px solid red',
                padding: 10
            } },
        Neact.createElement(
            "h1",
            null,
            "nobo"
        )
    ),
    Neact.createElement("i", null),
    Neact.createElement(
        "svg",
        { width: "100%", height: "500" },
        Neact.createElement("path", { d: "M250 150 L150 350 L350 350 Z" })
    ),
    Neact.createElement(
        MyApp,
        { x: "2", onClick: "f" },
        Neact.createElement(
            "div",
            null,
            Neact.createElement(
                "h1",
                null,
                "nobo"
            )
        )
    )
);

console.log(vnode);

Neact.render(vnode, demo);