importScripts('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js');

let pyodide = null;
async function initPyodide() { pyodide = await loadPyodide(); }
initPyodide();

onmessage = async (e) => {
  const imageData = e.data;
  const pythonCode = `
import numpy as np
def analyze(imageData):
    shape="Unknown"
    weight=np.random.uniform(0.1,100.0)
    volume=np.random.uniform(0.01,50.0)
    velocity=np.random.uniform(0,30)
    return {"shape":shape,"weight":weight,"volume":volume,"velocity":velocity}
analyze(${JSON.stringify(imageData.data.tolist())})
  `;
  const result = await pyodide.runPythonAsync(pythonCode);
  postMessage(result.toJs());
};
