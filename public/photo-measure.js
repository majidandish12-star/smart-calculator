/* =====================================
   Photo Measurement Engine
===================================== */

class PhotoMeasure {
  constructor(scaleKnownLength, scalePixelLength) {
    this.scale = scaleKnownLength / scalePixelLength;
  }

  measure(pixelLength) {
    return pixelLength * this.scale;
  }
}

window.PhotoMeasure = PhotoMeasure;
