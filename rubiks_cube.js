(function() {

  var div_main       = document.getElementById('main');
  var div_side       = document.getElementById('side');
  var button_reset   = document.getElementById('reset');
  var button_shuffle = document.getElementById('shuffle');
  var button_stop    = document.getElementById('stop');
  var input_speed    = document.getElementById('speed');

  var width  = div_main.clientWidth;
  var height = div_main.clientHeight;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, width / height, .01, 100);
  camera.position.set(5, 5, 5);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setClearColor(0xcccccc);
  div_main.appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  function render() {
    requestAnimationFrame(render);
    main();
    controls.update();
    renderer.render(scene, camera);
  }

  var i, cube, cos, sin, cos2, sin2, key, x, y, z;

  var cubes = [];
  var shuffle = false;
  var rolling = false;
  var theta = 0;
  var omega = Math.PI / 2 / Math.max(1, input_speed.value);
  var axis;
  var sign;
  var coord;

  function main() {
    if (rolling) {
      theta += omega;
      if (theta >= Math.PI / 2) {
        adjust();
      } else {
        update();
      }
    }
    if (!rolling && shuffle) {
      switch (Math.floor(Math.random() * 24)) {
        case  0: rotate('x', +1, +1); return;
        case  1: rotate('x', +1,  0); return;
        case  2: rotate('x', +1, -1); return;
        case  3: rotate('x', +1,  3); return;
        case  4: rotate('x', -1, +1); return;
        case  5: rotate('x', -1,  0); return;
        case  6: rotate('x', -1, -1); return;
        case  7: rotate('x', -1,  3); return;
        case  8: rotate('y', +1, +1); return;
        case  9: rotate('y', +1,  0); return;
        case 10: rotate('y', +1, -1); return;
        case 11: rotate('y', +1,  3); return;
        case 12: rotate('y', -1, +1); return;
        case 13: rotate('y', -1,  0); return;
        case 14: rotate('y', -1, -1); return;
        case 15: rotate('y', -1,  3); return;
        case 16: rotate('z', +1, +1); return;
        case 17: rotate('z', +1,  0); return;
        case 18: rotate('z', +1, -1); return;
        case 19: rotate('z', +1,  3); return;
        case 20: rotate('z', -1, +1); return;
        case 21: rotate('z', -1,  0); return;
        case 22: rotate('z', -1, -1); return;
        case 23: rotate('z', -1,  3); return;
      }
    }
  }

  function rotate(a, s, c) {
    rolling = true;
    theta = 0;
    axis = a;
    sign = s;
    coord = c;
  }

  function update() {
    cos = Math.cos(sign * theta);
    sin = Math.sin(sign * theta);
    cos2 = Math.cos(sign * theta / 2);
    sin2 = Math.sin(sign * theta / 2);
    for (i in cubes) {
      cube = cubes[i];
      if (coord == 3 || cube.p[axis] == coord) {
        switch (axis) {
          case 'x':
            cube.position.y = cos * cube.p.y - sin * cube.p.z;
            cube.position.z = sin * cube.p.y + cos * cube.p.z;
            cube.quaternion.w = cos2 * cube.q.w - sin2 * cube.q.x;
            cube.quaternion.x = sin2 * cube.q.w + cos2 * cube.q.x;
            cube.quaternion.y = cos2 * cube.q.y - sin2 * cube.q.z;
            cube.quaternion.z = sin2 * cube.q.y + cos2 * cube.q.z;
            break;
          case 'y':
            cube.position.z = cos * cube.p.z - sin * cube.p.x;
            cube.position.x = sin * cube.p.z + cos * cube.p.x;
            cube.quaternion.w = cos2 * cube.q.w - sin2 * cube.q.y;
            cube.quaternion.y = sin2 * cube.q.w + cos2 * cube.q.y;
            cube.quaternion.z = cos2 * cube.q.z - sin2 * cube.q.x;
            cube.quaternion.x = sin2 * cube.q.z + cos2 * cube.q.x;
            break;
          case 'z':
            cube.position.x = cos * cube.p.x - sin * cube.p.y;
            cube.position.y = sin * cube.p.x + cos * cube.p.y;
            cube.quaternion.w = cos2 * cube.q.w - sin2 * cube.q.z;
            cube.quaternion.z = sin2 * cube.q.w + cos2 * cube.q.z;
            cube.quaternion.x = cos2 * cube.q.x - sin2 * cube.q.y;
            cube.quaternion.y = sin2 * cube.q.x + cos2 * cube.q.y;
            break;
        }
      }
    }
  }

  function adjust() {
    theta = Math.PI / 2;
    update();
    for (i in cubes) {
      cube = cubes[i];
      cube.position.round();
      round(cube.quaternion);
      cube.p.copy(cube.position);
      cube.q.copy(cube.quaternion);
    }
    rolling = false;
    theta = 0;
  }

  function round(q) {
    for (key in q) {
      for (x = -1; x <= 1; x++) {
        if (Math.abs(q[key] - x) < .01) {
          q[key] = x;
        }
      }
    }
  }

  (function() {
    var geometry = new THREE.BoxGeometry(.9, .9, .9);
    var white  = new THREE.MeshBasicMaterial({color: 0xffffff});
    var yellow = new THREE.MeshBasicMaterial({color: 0xffff00});
    var red    = new THREE.MeshBasicMaterial({color: 0xcc0000});
    var orange = new THREE.MeshBasicMaterial({color: 0xff6600});
    var blue   = new THREE.MeshBasicMaterial({color: 0x0000cc});
    var green  = new THREE.MeshBasicMaterial({color: 0x009900});
    var black  = new THREE.MeshBasicMaterial({color: 0x000000});
    for (x = -1; x <= 1; x++) {
      for (y = -1; y <= 1; y++) {
        for (z = -1; z <= 1; z++) {
          cube = new THREE.Mesh(
            geometry,
            new THREE.MeshFaceMaterial([
              x == +1 ? white  : black,
              x == -1 ? yellow : black,
              y == +1 ? red    : black,
              y == -1 ? orange : black,
              z == +1 ? blue   : black,
              z == -1 ? green  : black]));
          cube.position.set(x, y, z);
          cube.initial = cube.position.clone();
          cube.p = cube.position.clone();
          cube.q = cube.quaternion.clone();
          scene.add(cube);
          cubes.push(cube);
        }
      }
    }
  })();

  render();

  document.onkeydown = function(event) {
    if (rolling) {
      adjust();
    }
    switch (event.keyCode) {
      case 70: rotate('x', +1, +1); return;
      case 68: rotate('x', +1,  0); return;
      case 83: rotate('x', +1, -1); return;
      case 65: rotate('x', +1,  3); return;
      case 82: rotate('x', -1, +1); return;
      case 69: rotate('x', -1,  0); return;
      case 87: rotate('x', -1, -1); return;
      case 81: rotate('x', -1,  3); return;
      case 89: rotate('y', +1, +1); return;
      case 72: rotate('y', +1,  0); return;
      case 78: rotate('y', +1, -1); return;
      case 77: rotate('y', +1,  3); return;
      case 84: rotate('y', -1, +1); return;
      case 71: rotate('y', -1,  0); return;
      case 66: rotate('y', -1, -1); return;
      case 86: rotate('y', -1,  3); return;
      case 85: rotate('z', +1, +1); return;
      case 73: rotate('z', +1,  0); return;
      case 79: rotate('z', +1, -1); return;
      case 80: rotate('z', +1,  3); return;
      case 74: rotate('z', -1, +1); return;
      case 75: rotate('z', -1,  0); return;
      case 76: rotate('z', -1, -1); return;
      case 59: case 186:
               rotate('z', -1,  3); return;
    }
  };

  button_reset.onclick = function() {
    for (i in cubes) {
      cube = cubes[i];
      cube.position.copy(cube.initial);
      cube.quaternion.set(0, 0, 0, 1);
      cube.p.copy(cube.position);
      cube.q.copy(cube.quaternion);
    }
  };

  button_shuffle.onclick = function() {
    shuffle = true;
  };

  button_stop.onclick = function() {
    shuffle = false;
  };

  input_speed.onchange = function() {
    omega = Math.PI / 2 / Math.max(1, input_speed.value);
  };

})();
