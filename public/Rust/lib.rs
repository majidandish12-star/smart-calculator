// src/lib.rs
use wasm_bindgen::prelude::*;
use serde::Serialize;

// =========================================================
// HyperCalc Ultimate – Object Physics & Reality Engine
// Author: Majid Andishmandzade
// Role:
// - Single & Multi Object Physics Calculation
// - Advanced Energy, Momentum, Force, Torque, Pressure
// - Supports Optional Angular Velocity & Height
// - AI Metadata for ExplainEngine
// =========================================================

#[wasm_bindgen]
#[derive(Serialize)]
pub struct HyperObject {
    pub weight: f64,
    pub volume: f64,
    pub density: f64,
    pub kinetic_energy: f64,
    pub potential_energy: f64,
    pub momentum: f64,
    pub force: f64,
    pub pressure: f64,
    pub velocity: f64,
    pub angular_velocity: Option<f64>,
    pub torque: Option<f64>,
    pub total_energy: f64,
    pub comments: Vec<String>,
}

#[wasm_bindgen]
pub fn calculate_object(
    weight: f64,
    velocity: f64,
    volume: f64,
    height: Option<f64>,
    angular_velocity: Option<f64>,
    temperature: Option<f64>
) -> JsValue {

    let h = height.unwrap_or(1.0);
    let av = angular_velocity.unwrap_or(0.0);
    let temp = temperature.unwrap_or(25.0);

    let density = if volume != 0.0 { weight / volume } else { 0.0 };
    let kinetic_energy = 0.5 * weight * velocity.powi(2);
    let potential_energy = weight * 9.81 * h;
    let momentum = weight * velocity;
    let force = weight * 9.81;
    let pressure = if volume != 0.0 { force / volume } else { 0.0 };
    let torque = av * weight * 0.5; // simplified
    let total_energy = kinetic_energy + potential_energy + 0.5 * torque;

    let mut comments = vec![];
    if weight > 1000.0 { comments.push("⚠ Heavy object".to_string()); }
    if velocity > 50.0 { comments.push("⚠ High speed – relativistic ignored".to_string()); }
    if total_energy > 10000.0 { comments.push("⚡ Extremely high energy".to_string()); }
    comments.push(format!("🌡 Temperature: {}C", temp));
    comments.push(format!("🕒 Timestamp: {:?}", js_sys::Date::new_0()));

    let obj = HyperObject {
        weight, volume, density, kinetic_energy, potential_energy,
        momentum, force, pressure, velocity, angular_velocity: Some(av),
        torque: Some(torque), total_energy, comments
    };

    JsValue::from_serde(&obj).unwrap()
}

// =========================================================
// Calculate Multiple Objects Simultaneously
// =========================================================
#[wasm_bindgen]
pub fn calculate_multiple(
    weights: Box<[f64]>,
    velocities: Box<[f64]>,
    volumes: Box<[f64]>,
    heights: Option<Box<[f64]>>,
    angular_velocities: Option<Box<[f64]>>,
    temperatures: Option<Box<[f64]>>
) -> JsValue {
    let mut result = Vec::new();
    let hts = heights.unwrap_or(Box::new(vec![1.0; weights.len()]));
    let avs = angular_velocities.unwrap_or(Box::new(vec![0.0; weights.len()]));
    let temps = temperatures.unwrap_or(Box::new(vec![25.0; weights.len()]));

    for i in 0..weights.len() {
        let obj = calculate_object(
            weights[i],
            velocities[i],
            volumes[i],
            Some(hts[i]),
            Some(avs[i]),
            Some(temps[i])
        );
        result.push(obj);
    }

    JsValue::from_serde(&result).unwrap()
}

// =========================================================
// Extra Utilities
// =========================================================
#[wasm_bindgen]
pub fn calculate_total_energy(weights: Box<[f64]>, velocities: Box<[f64]>, heights: Box<[f64]>) -> f64 {
    let mut total = 0.0;
    for i in 0..weights.len() {
        let ke = 0.5 * weights[i] * velocities[i].powi(2);
        let pe = weights[i] * 9.81 * heights[i];
        total += ke + pe;
    }
    total
}

#[wasm_bindgen]
pub fn physics_summary(weight: f64, velocity: f64, volume: f64) -> JsValue {
    let data = calculate_object(weight, velocity, volume, Some(1.0), Some(0.0), Some(25.0));
    let obj: HyperObject = data.into_serde().unwrap();
    let summary = format!(
        "Density: {:.2}, KE: {:.2}, PE: {:.2}, Momentum: {:.2}, Force: {:.2}, Pressure: {:.2}, Total Energy: {:.2}",
        obj.density, obj.kinetic_energy, obj.potential_energy,
        obj.momentum, obj.force, obj.pressure, obj.total_energy
    );
    JsValue::from_str(&summary)
    }
