AFRAME.registerComponent('spatial-tool', {
  init: function() {
    this.isProjectionMatrixSet = false;

    this.aframeCamera = this.el.querySelector('a-camera');
    this.aframeContainer = this.el.querySelector('#container');

    this.tryToLoadSpatialInterface(10);

    window.addEventListener('resize', this.onResize.bind(this));
  },

  tryToLoadSpatialInterface: function(retries) {
    if (retries < 0) {
      console.log('Failed to load spatial interface');
      return;
    }

    if (typeof SpatialInterface === 'undefined') {
      setTimeout(() => {
        this.tryToLoadSpatialInterface(retries - 1);
      }, 200);
      return;
    }

    let spatialInterface = new SpatialInterface();

    if (spatialInterface) {
      spatialInterface.setFullScreenOn();
      spatialInterface.addMatrixListener(this.renderScene.bind(this));

      let rig = this.el.querySelector('#camera-rig');
      if (rig) {
        rig.setAttribute('position', '0 0 0');
        rig.setAttribute('rotation', '0 0 0');
      }
    }
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
