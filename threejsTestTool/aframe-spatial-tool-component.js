AFRAME.registerComponent('spatial-tool', {
  init: function() {
    this.isProjectionMatrixSet = false;

    this.aframeCamera = this.el.querySelector('a-camera');
    this.aframeContainer = this.el.querySelector('#container');

    console.log('acam', this.aframeCamera);
    console.log('acon', this.aframeContainer);

    let spatialInterface;
    if (typeof SpatialInterface !== 'undefined') {
      spatialInterface = new SpatialInterface();
    }

    if (spatialInterface) {
      spatialInterface.setFullScreenOn();
      spatialInterface.addMatrixListener(this.renderScene.bind(this));
    }

    window.addEventListener('resize', this.onResize.bind(this));
  },

  renderScene: function(modelViewMatrix, projectionMatrix) {
    this.camera = this.aframeCamera.object3D.children[0];
    this.container = this.aframeContainer.object3D;
    this.renderer = this.el.renderer;

    if (projectionMatrix.length > 0) {
      this.setMatrixFromArray(this.camera.projectionMatrix, projectionMatrix);
      this.isProjectionMatrixSet = true;
    }

    // 10. Every frame, set the position of the container to the modelViewMatrix
    if (this.isProjectionMatrixSet) {
      if (this.container.matrixAutoUpdate) {
        this.container.matrixAutoUpdate = false;
      }
      this.setMatrixFromArray(this.container.matrix, modelViewMatrix);
    }
  },

  onResize: function() {
    let rendererWidth = window.innerWidth;
    let rendererHeight = window.innerHeight;

    if (this.camera) {
      this.camera.aspect = rendererWidth / rendererHeight;
      this.camera.updateProjectionMatrix();
    }

    if (this.renderer) {
      this.renderer.setSize(rendererWidth, rendererHeight);
    }
  },

  // This is just a helper function to set a three.js matrix using an array
  setMatrixFromArray: function(matrix, array) {
    matrix.set(
      array[0], array[4], array[8], array[12],
      array[1], array[5], array[9], array[13],
      array[2], array[6], array[10], array[14],
      array[3], array[7], array[11], array[15]);
  },
});
