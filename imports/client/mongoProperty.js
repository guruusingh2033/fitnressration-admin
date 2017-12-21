function setPropertyPath(obj, prop, value) {
  if (typeof prop === "string")
      prop = prop.split(".");

  if (prop.length > 1) {
      var e = prop.shift();
      setPropertyPath(obj[e] =
               Object.prototype.toString.call(obj[e]) === "[object Object]"
               ? obj[e]
               : {},
             prop,
             value);
  } else
      obj[prop[0]] = value;
}

function getPropertyPath(obj, prop) {
  if (typeof prop === "string")
      prop = prop.split(".");

  if (prop.length > 1) {
      var e = prop.shift();
      return getPropertyPath(obj[e] =
               Object.prototype.toString.call(obj[e]) === "[object Object]"
               ? obj[e]
               : {},
             prop);
  } else
      return obj[prop[0]];

}

export function mongoProperty(obj, objName, collection, doc, documentProperty, defaultValue) {
  Object.defineProperty(obj, objName, {
    configurable: true,
    get: function() {
      var _doc = typeof doc == 'function' ? doc() : doc
      if (_doc) {
        var r = getPropertyPath(typeof doc == 'function' ? doc() : doc, documentProperty);
        if (typeof r == 'undefined') {
          return defaultValue;
        }
        else {
          return r;
        }
      }
    },
    set: function(value) {
      var _doc = typeof doc == 'function' ? doc() : doc
      if (_doc) {
        setPropertyPath(_doc, documentProperty, value);
        var data = {};
        data[documentProperty] = value;
        collection.update({_id:_doc._id}, {'$set':data});
      }
    }
  });
}
