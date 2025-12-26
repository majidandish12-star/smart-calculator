/* =====================================
   Canvas Measure Tool
===================================== */

class CanvasMeasure {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.points = [];
    this.canvas = canvas;

    canvas.addEventListener("click", e => this.addPoint(e));
  }

  addPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    const p = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    this.points.push(p);
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.beginPath();
    this.points.forEach((p, i) => {
      if (i === 0) this.ctx.moveTo(p.x, p.y);
      else this.ctx.lineTo(p.x, p.y);
    });
    this.ctx.strokeStyle = "#00ffcc";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  getLength() {
    let len = 0;
    for (let i = 1; i < this.points.length; i++) {
      len += Math.hypot(
        this.points[i].x - this.points[i - 1].x,
        this.points[i].y - this.points[i - 1].y
      );
    }
    return len;
  }
}

window.CanvasMeasure = CanvasMeasure;
