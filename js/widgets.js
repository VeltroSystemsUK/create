FB.widgets = {};
FB.widgets._registry = {};

FB.widgets.register = function (type, def) {
  FB.widgets._registry[type] = def;
};

FB.widgets.get = function (type) {
  return FB.widgets._registry[type] || null;
};

FB.widgets.render = function (type, props) {
  var def = FB.widgets.get(type);
  if (!def)
    return (
      '<div style="padding:1rem;color:#999">Unknown widget: ' + type + "</div>"
    );
  return def.render(props);
};

FB.widgets.getEditPanel = function (type, blockId, props) {
  var def = FB.widgets.get(type);
  if (!def) return "";
  return def.editPanel(blockId, props);
};

FB.widgets.byCategory = function (cat) {
  var result = {};
  Object.keys(FB.widgets._registry).forEach(function (type) {
    if (FB.widgets._registry[type].category === cat) {
      result[type] = FB.widgets._registry[type];
    }
  });
  return result;
};
