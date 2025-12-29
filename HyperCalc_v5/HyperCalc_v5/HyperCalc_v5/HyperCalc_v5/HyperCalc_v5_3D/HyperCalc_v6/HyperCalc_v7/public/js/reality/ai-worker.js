self.onmessage=e=>{
  const {type,payload}=e.data; let result=null;
  if(type==='image'){ result={object:'detected',confidence:0.97}; }
  else if(type==='canvas'){ result={shape:'freeform',area:payload.length*12,confidence:0.92}; }
  else if(type==='map'){ let dist=0; for(let i=1;i<payload.length;i++){ const dx=payload[i].x-payload[i-1].x; const dy=payload[i].y-payload[i-1].y; dist+=Math.sqrt(dx*dx+dy*dy);} result={distance:dist,unit:'m',confidence:0.94}; }
  self.postMessage({type,result,timestamp:Date.now()});
}
