// src/lib.rs
use wasm_bindgen::prelude::*;
use serde::{Serialize};

#[wasm_bindgen]
#[derive(Serialize)]
pub struct ObjectData {
    pub weight: f64,
    pub volume: f64,
    pub density: f64,
    pub kinetic_energy: f64,
    pub momentum: f64,
}

#[wasm_bindgen]
pub fn calculate_object(weight: f64, velocity: f64, volume: f64) -> JsValue {
    let density = weight / volume;
    let kinetic_energy = 0.5 * weight * velocity.powi(2);
    let momentum = weight * velocity;

    let data = ObjectData {
        weight,
        volume,
        density,
        kinetic_energy,
        momentum,
    };

    JsValue::from_serde(&data).unwrap()
}

// محاسبه چند شیء
#[wasm_bindgen]
pub fn calculate_multiple(weights: Box<[f64]>, velocities: Box<[f64]>, volumes: Box<[f64]>) -> JsValue {
    let mut result = Vec::new();
    for i in 0..weights.len() {
        let obj = calculate_object(weights[i], velocities[i], volumes[i]);
        result.push(obj);
    }
    JsValue::from_serde(&result).unwrap()
}
