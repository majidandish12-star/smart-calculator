/* =====================================
   Geometry Engine – Smart Calculator
===================================== */

class GeometryEngine {
  rectangle(width, height) {
    return {
      shape: "rectangle",
      area: width * height,
      perimeter: 2 * (width + height)
    };
  }

  circle(radius) {
    return {
      shape: "circle",
      area: Math.PI * radius * radius,
      circumference: 2 * Math.PI * radius
    };
  }

  triangle(a, b, c) {
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    return {
      shape: "triangle",
      area,
      perimeter: a + b + c
    };
  }

  distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }
}

window.GeometryEngine = GeometryEngine;
