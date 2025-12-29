/* =====================================
   Map Analyzer
   HyperCalc v3
===================================== */

class MapAnalyzer {
  analyze(points) {
    let distance = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i-1].x;
      const dy = points[i].y - points[i-1].y;
      distance += Math.sqrt(dx*dx + dy*dy);
    }
    return {
      distance,
      unit: 'meters',
      confidence: 0.8
    };
  }
}

self.MapAnalyzer = MapAnalyzer;
