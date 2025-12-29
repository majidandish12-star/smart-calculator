/* =========================================================
   WASM Bridge Layer
   Responsibility: Load & communicate with Rust WASM
========================================================= */

let wasmInstance = null;

/**
 * Initialize WASM module
 */
export async function initWasm() {
  if (wasmInstance) return wasmInstance;

  const wasmUrl = "./pkg/hypercalc_wasm.js";

  const wasmModule = await import(wasmUrl);
  await wasmModule.default();

  wasmInstance = wasmModule;
  return wasmInstance;
}

/**
 * Physics calculation via WASM
 */
export function physicsFromWasm({ mass, velocity, volume }) {
  if (!wasmInstance) {
    throw new Error("WASM not initialized");
  }

  return wasmInstance.calculate_physics(
    Number(mass),
    Number(velocity),
    Number(volume)
  );
}
