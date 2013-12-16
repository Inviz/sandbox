GL = function(canvas) {
  if (typeof canvas == 'string')
    canvas = document.getElementById(canvas);
  var options = {antialias: false}
  return canvas.getContext('experimental-webgl', options)
}

GL.Shader = function(gl, type, source) {
  type = gl[GL.Shader.types[type]]

  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var lastError = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw "*** Error compiling shader '" + shader + "':" + lastError;
  }

  return shader;
}

GL.Shader.types = {
  'x-shader/x-vertex':   'VERTEX_SHADER',
  'shader/vertex':       'VERTEX_SHADER',
  'vertex':              'VERTEX_SHADER',
  'VERTEX_SHADER':       'VERTEX_SHADER',
  'x-shader/x-fragment': 'FRAGMENT_SHADER',
  'shader/fragment':     'FRAGMENT_SHADER',
  'fragment':            'FRAGMENT_SHADER',
  'FRAGMENT_SHADER':      'FRAGMENT_SHADER',
  'undefined':           'FRAGMENT_SHADER'
}

GL.Script = function(gl, id, callback) {
  var script = document.getElementById(id);
  return GL.Shader(gl, script.type, callback && callback(script.text) || script.text)
}

GL.Program = function(gl, shaders, attributes, locations) {
  var program = gl.createProgram();
  for (var i = 0; i < shaders.length; ++i)
    gl.attachShader(program, shaders[i]);

  if (attributes)
    for (var i = 0; i < attributes.length; ++i)
      gl.bindAttribLocation(
        program,
        locations ? locations[i] : i,
        attributes[i]);

  gl.linkProgram(program);

  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var lastError = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw "Error in program linking:" + lastError;
  }

  gl.useProgram(program);

  return program;
};

GL.Texture = function(gl, index, image, wrap) {
  var old = this != GL && this != window
  var texture = old ? this : gl.createTexture();
  if (index != null) {
    gl.activeTexture(gl.TEXTURE0 + index)
    gl.bindTexture(gl.TEXTURE_2D, texture);
  }
  if (image != null) {
    if (old)
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    else
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }
  if (wrap) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return texture;
}