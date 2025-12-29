self.onmessage = e => {
  const { type, data } = e.data;
  let result = null;
  if(type==='image') result={object:'AI-Predicted',confidence:0.95};
  if(type==='canvas') result={shape:'FreeForm',area:data.length*0.5,confidence:0.9};
  if(type==='map') result={distance:data.length*1.2,unit:'meters',confidence:0.85};
  self.postMessage({ type, result, timestamp: Date.now() });
};
