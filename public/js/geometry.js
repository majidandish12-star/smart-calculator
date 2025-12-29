/* =====================================
   Geometry Engine
   HyperCalc v2
===================================== */

class GeometryEngine {
  circleArea(r) {
    return Math.PI * r * r;
  }

  rectangleArea(w, h) {
    return w * h;
  }

  sphereVolume(r) {
    return (4/3) * Math.PI * Math.pow(r, 3);
  }

  boxVolume(w, h, d) {
    return w * h * d;
  }
}

window.GeometryEngine = GeometryEngine;
