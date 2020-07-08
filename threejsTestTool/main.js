let aframeCamera = document.getElementById('camera');
let aframeContainer = document.getElementById('container');

let camera, container, renderer;
let rendererWidth = screen.height; // width is height because landscape orientation
let rendererHeight = screen.width; // height is width
let isProjectionMatrixSet = false;

let spatialInterface;

if (typeof SpatialInterface !== 'undefined') {
  spatialInterface = new SpatialInterface();
}

window.onload = function() {
  init();
};

function init() {
  // 7. Use the Spatial Toolbox APIs to prepare to render correctly
  if (spatialInterface) {
    spatialInterface.setFullScreenOn();
    spatialInterface.addMatrixListener(renderScene);
  }
}

// 8. This main rendering loop will get called 60 times per second
function renderScene(modelViewMatrix, projectionMatrix) {
  camera = aframeCamera.object3D.children[0];
  container = aframeContainer.object3D;
  renderer = document.querySelector('a-scene').renderer;

  // 9. only set the projection matrix for the camera 1 time, since it stays the same
  if (projectionMatrix.length > 0) {
    setMatrixFromArray(camera.projectionMatrix, projectionMatrix);
    isProjectionMatrixSet = true;
  }

  // 10. Every frame, set the position of the container to the modelViewMatrix
  if (isProjectionMatrixSet) {
    if (container.matrixAutoUpdate) {
      container.matrixAutoUpdate = false;
    }
    setMatrixFromArray(container.matrix, modelViewMatrix);
  }
}

// 11. This is just a helper function to set a three.js matrix using an array
function setMatrixFromArray(matrix, array) {
  matrix.set(
    array[0], array[4], array[8], array[12],
    array[1], array[5], array[9], array[13],
    array[2], array[6], array[10], array[14],
    array[3], array[7], array[11], array[15]);
}

// 12. Make sure the 3d renderer always has the right aspect ratio of the screen
window.addEventListener('resize', function() {
  rendererWidth = window.innerWidth;
  rendererHeight = window.innerHeight;

  if (camera) {
    camera.aspect = rendererWidth / rendererHeight;
    camera.updateProjectionMatrix();
  }

  if (renderer) {
    renderer.setSize(rendererWidth, rendererHeight);
  }
});

