function createElement(tagName) {
    return document.createElement(tagName);
}

function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}

function createTextNode(text) {
    return document.createTextNode(text);
}


function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}


function removeChild(node, child) {
    node.removeChild(child);
}

function appendChild(node, child) {
    node.appendChild(child);
}

function parentNode(node) {
    return node.parentElement;
}

function nextSibling(node) {
    return node.nextSibling;
}

function tagName(node) {
    return node.tagName;
}

function setTextContent(node, text) {
    if (node.nodeType === 3) {
        node.data = text;
    } else {
        if ('textContent' in node) {
            node.textContent = text;
        } else {
            node.innerText = text;
        }
    }
}

function addEventListener(node, name, fn) {
    if (typeof node.addEventListener == "function")
        node.addEventListener(name, fn, false);
    else if (typeof node.attachEvent != "undefined") {
        var attachEventName = "on" + name;
        node.attachEvent(attachEventName, fn);
    }
}

function removeEventListener(node, name, fn) {
    if (typeof node.removeEventListener == "function")
        node.removeEventListener(name, fn, false);
    else if (typeof node.detachEvent != "undefined") {
        var attachEventName = "on" + name;
        node.detachEvent(attachEventName, fn);
    }
}

module.exports = {
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    appendChild: appendChild,
    removeChild: removeChild,
    insertBefore: insertBefore,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
};