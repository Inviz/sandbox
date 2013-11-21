GL = function(canvas) {
  if (typeof canvas == 'string')
    canvas = document.getElementById(canvas);
  var options = {antialias: false}
  return canvas.getContext('experimental-webgl', options)
}

GL.Shader = function(gl, type, source) {
  type = gl[GL.Shader.types[type]]

  // Create the shader object
  var shader = gl.createShader(type);

  // Load the shader source
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the compile] status
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
  'FRAGMENT_SHADR':      'FRAGMENT_SHADER',
  'undefined':           'FRAGMENT_SHADER'
}

GL.Script = function(gl, id) {
  var script = document.getElementById(id);
  return GL.Shader(gl, script.type, script.text)
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

  // Check the link status
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var lastError = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw "Error in program linking:" + lastError;
  }

  gl.useProgram(program);

  return program;
};

GL.Program.Attribute = function(gl, program, name) {
  return gl.getAttribLocation(program, name);
}

GL.Program.Uniform = function(gl, program, name) {
  return gl.getUniformLocation(program, name);
}

GL.Buffer = function(gl, type, data, method) {
  type = gl[GL.Buffer.types[type]];
  method = gl[GL.Buffer.methods[method]];

  var buffer = gl.createBuffer();
  gl.bindBuffer(type, buffer);
  if (data != null)
    gl.bufferData(type, data, method);
  return buffer;
}


GL.Buffer.types = {
  'array':        'ARRAY_BUFFER',
  'ARRAY_BUFFER': 'ARRAY_BUFFER',
  'array_buffer': 'ARRAY_BUFFER',
  'undefined':    'ARRAY_BUFFER'
}

GL.Buffer.methods = {
  'static_draw': 'STATIC_DRAW',
  'STATIC_DRAW': 'STATIC_DRAW',
  'static':      'STATIC_DRAW',
  'undefined':   'STATIC_DRAW'
}

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
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  /*
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
  */
  return texture;
}