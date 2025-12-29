use wasm_bindgen::prelude::*;
use serde::Serialize;

#[derive(Serialize)]
pub struct Physics {
    pub energy: f64,
    pub momentum: f64,
    pub density: f64
}

#[wasm_bindgen]
pub fn calc_physics(mass: f64, velocity: f64, volume: f64) -> JsValue {
    let energy = 0.5 * mass * velocity * velocity;
    let momentum = mass * velocity;
    let density = if volume>0.0 { mass/volume } else {0.0};
    JsValue::from_serde(&Physics{energy,momentum,density}).unwrap()
}
