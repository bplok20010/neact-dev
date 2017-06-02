module.exports = function(sel, data, children, text, elm) {
  var key = data === undefined ? undefined : data.key;
  return {sel: sel, data: data, children: children,name: data ? data.name : 'dom',
          text: text, elm: elm, key: key};
};
