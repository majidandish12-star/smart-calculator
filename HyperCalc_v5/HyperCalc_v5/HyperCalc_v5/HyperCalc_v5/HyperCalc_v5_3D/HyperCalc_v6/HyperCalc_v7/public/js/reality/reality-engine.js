export class RealityEngine {
  constructor(workerPath='./ai-worker.js'){ this.worker=new Worker(workerPath); }
  analyzeImage(imageData){ return this._send('image',imageData); }
  analyzeCanvas(strokes){ return this._send('canvas',strokes); }
  analyzeMap(points){ return this._send('map',points); }
  _send(type,payload){ return new Promise(resolve=>{ this.worker.onmessage=e=>resolve(e.data); this.worker.postMessage({type,payload}); }); }
}
