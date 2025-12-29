import init, { calculate_physics } from "./pkg/hypercalc_wasm.js";

let wasmReady = false;

export async function initWasm() {
  if (!wasmReady) {
    await init();
    wasmReady = true;
    console.log("✅ WASM initialized");
  }
}

export function physicsFromWasm({ mass, velocity, volume }) {
  if (!wasmReady) {
    throw new Error("WASM not initialized");
  }

  return calculate_physics(mass, velocity, volume);
}
