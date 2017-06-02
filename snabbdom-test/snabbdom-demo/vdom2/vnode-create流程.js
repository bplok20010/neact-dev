var element1 = React.createElement(App);
var element2 = React.createElement('div');
var element3 = React.createElement(null);
element3.text = 'textNode'

createElementInstance(element1)
createElementInstance(element2)
createElementInstance(element2)

function DOMComponent() {

}

function TextComponent() {

}

function ClassComponent() {

}

function createElementInstance(element) {
    if (isDOM) {
        return DOMComponent(element)
    } else if (isDOMText) {
        return DOMTextComponent(element)
    } else {
        return CompositeComponent(element)
    }
}