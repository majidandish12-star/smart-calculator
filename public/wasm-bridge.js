/* =========================================================
   Legendary WASM Bridge Layer
   Responsibility: Load & communicate with Rust WASM
   + AutoTrainer & AI Insights
========================================================= */

let wasmInstance = null;

/**
 * Initialize WASM module safely
 */
export async function initWasm() {
  if (wasmInstance) return wasmInstance;

  try {
    const wasmUrl = "./pkg/hypercalc_wasm.js";
    const wasmModule = await import(wasmUrl);
    await wasmModule.default();
    wasmInstance = wasmModule;
    console.log("🦀 HyperCalc WASM ready");
    return wasmInstance;
  } catch(e) {
    console.warn("⚠ WASM unavailable – JS fallback will be used", e);
    wasmInstance = null;
    return null;
  }
}

/**
 * Physics calculation via WASM (or fallback JS)
 */
export function physicsFromWasm({ mass, velocity, volume }) {
  if (!mass || !velocity || !volume) {
    console.warn("⚠ Missing input parameters for physics calculation");
  }

  // Fallback JS engine
  const fallbackPhysics = () => ({
    energy: 0.5 * Number(mass || 0) * Number(velocity || 0) ** 2,
    volume: Number(volume || 0),
    mass: Number(mass || 0),
  });

  if (!wasmInstance) return fallbackPhysics();

  try {
    const energy = wasmInstance.calculate_physics(
      Number(mass),
      Number(velocity),
      Number(volume)
    );

    // AutoTrainer suggestion: large energy
    const suggestions = [];
    if(energy > 1000) suggestions.push("⚡ High kinetic energy – check calculation units");
    if(energy === 0) suggestions.push("💡 Zero energy detected – verify inputs");

    console.log("🔹 Physics result:", { mass, velocity, volume, energy }, suggestions);
    return { mass, velocity, volume, energy, suggestions };
  } catch(e) {
    console.error("❌ WASM physics calculation failed:", e);
    return fallbackPhysics();
  }
}

/**
 * WASM instance getter
 */
export function getWasmInstance() {
  return wasmInstance;
}
