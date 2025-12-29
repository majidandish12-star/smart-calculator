use wasm_bindgen::prelude::*;
use serde::Serialize;

#[derive(Serialize)]
pub struct Physics {
    pub energy: f64,
    pub momentum: f64,
    pub density: f64,
    pub predicted_energy: f64
}

#[wasm_bindgen]
pub fn calc_physics(mass: f64, velocity: f64, volume: f64) -> JsValue {
    let energy = 0.5 * mass * velocity * velocity;
    let predicted_energy = energy * 1.05; // AI prediction layer
    let momentum = mass * velocity;
    let density = if volume > 0.0 { mass / volume } else { 0.0 };

    let result = Physics { energy, momentum, density, predicted_energy };

    JsValue::from_serde(&result).unwrap()
}
