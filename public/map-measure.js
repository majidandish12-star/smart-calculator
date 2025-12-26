/* =====================================
   Map Measure Engine
===================================== */

class MapMeasure {
  distance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = this._deg2rad(lat2 - lat1);
    const dLon = this._deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this._deg2rad(lat1)) *
        Math.cos(this._deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  _deg2rad(d) {
    return d * (Math.PI / 180);
  }
}

window.MapMeasure = MapMeasure;
