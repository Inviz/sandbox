// Value iterator that filters attributes by type 
Game.Value = function(object, type, reference, callback, method, arg, recursive) {
  if (typeof object == 'number') {
    // remove reference
    if (object > 9999999)
      object = Math.floor(object / 1000000000);
    // return value without type
    return object % 1000;
  } else {
    if (object._index) {
      if (object._length === undefined)
        object = Game.Type.Properties(object);
      var j = object._length;
      if (!j)
        return;
    } else {
      var j = object.length;
    }

    if (typeof reference == 'function') {
      callback = reference;
      reference = null;
    }
    type = Game.Type(type)
    var result;
    var start = type._start, end = type._end;
    if (typeof method != 'function')
      method = Game.Value[method || 'sum'];
    if (!recursive)
      recursive = method.properties;

    var ref, value, now, subject, mapped;
    for (var i = 0; i < j; i++) {
      // parse each property in array
      var kind = object[i];
      var multiplier = kind < 0 ? -1 : 1;
      kind *= multiplier;
      value = ref = now = subject = mapped = null;
      var origin = reference;
      if (kind > 9999999) {
        ref = kind % 1000000000;
        kind = Math.floor((kind - ref) / 1000000000);
      }
      if (kind > 9999) {
        value = (kind % 1000) * multiplier;
        kind = Math.floor((kind - value) / 1000);
      }
      // check if property matches given type
      if (recursive && kind >= start && kind < end && ref == (reference || 0)) {
        now = value;
      // handle game data reference (type of creature, action or item)
      } else if (method.references && kind > Game.properties._end) {
        subject = Game[kind]
        if (method.output == null)
          now = value;
      // handle equipment
      } else if (method.equipment && kind >= Game.equipment._start && kind < Game.equipment._end) {
        if (inherit == null)
          var inherit = type.inherit || false;
        if (inherit)
          subject = Game.Referenced(ref);
      }
      // process referenced object
      if (subject) {
        now = method(subject, type, reference, callback, true);
        if (now != null) {  
          var n = now < 0 ? -1 : 1;
          now *= n;
          if (now > 9999999) {
            origin = now % 1000000000;
            now = Math.floor((now - origin) / 1000000000);
          }
          if (now > 9999) {
            value = now % 1000;
            kind = Math.floor((now - value) / 1000);
            now = value;
          }
          now *= n;
        }
      }
      if (now != null) {
        var r = (origin == null ? ref : origin) || null
        var transformed = now;
        if (callback && (method.output == null || !subject)) {
          var mapped = callback(subject || object, Game[kind], transformed, r, arg);
          if (typeof mapped == 'number')
            transformed = mapped;
        }
        if (method.iterator) {
          var mapped = method.iterator(result, transformed, object, Game[kind], r, arg);
          if (mapped !== result) {
            var resulting = kind;
            result = mapped;
          }
        } else {
          result = transformed;
        }
        if (method.single)
          break;
      }
      // location
      if (kind < 2000 && type._index == 1000)
        return object[i];
    }
    if (method.reducer)
      return method.reducer(result, object, type, reference, arg, i, value)
    else if (method.output === false && typeof result == 'number')
      return Game.Attribute(resulting || type, result, reference);
    else
      return result;
  }
}
