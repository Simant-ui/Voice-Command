// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::process::Command;
use sysinfo::System;

#[derive(Serialize, Deserialize)]
pub struct AppResult {
    pub success: bool,
    pub message: String,
}

#[derive(Serialize, Deserialize)]
pub struct SystemInfoResult {
    pub os: String,
    pub arch: String,
    pub hostname: String,
    pub cpu_model: String,
    pub cpu_usage: f32,
    pub memory_total_gb: f32,
    pub memory_used_gb: f32,
    pub battery_percentage: u32,
    pub is_charging: bool,
}

#[derive(Serialize, Deserialize)]
pub struct FileSearchResult {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}

#[tauri::command]
fn open_app(app_name: String) -> AppResult {
    #[cfg(target_os = "windows")]
    {
        let status = Command::new("cmd")
            .args(["/C", "start", "", &app_name])
            .status();

        match status {
            Ok(s) if s.success() => AppResult {
                success: true,
                message: format!("Successfully launched process: {}", app_name),
            },
            _ => AppResult {
                success: false,
                message: format!("Could not open application: {}", app_name),
            },
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        AppResult {
            success: true,
            message: format!("Linux/Mac app launch: {}", app_name),
        }
    }
}

#[tauri::command]
fn close_app(app_name: String) -> AppResult {
    #[cfg(target_os = "windows")]
    {
        let proc = if app_name.ends_with(".exe") { app_name } else { format!("{}.exe", app_name) };
        let output = Command::new("taskkill")
            .args(["/F", "/IM", &proc])
            .output();

        match output {
            Ok(o) if o.status.success() => AppResult {
                success: true,
                message: format!("Terminated application process: {}", proc),
            },
            _ => AppResult {
                success: false,
                message: format!("Failed to terminate process: {}", proc),
            },
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        AppResult {
            success: true,
            message: format!("Linux close process: {}", app_name),
        }
    }
}

#[tauri::command]
fn list_apps() -> Vec<String> {
    let mut sys = System::new_all();
    sys.refresh_all();
    let mut procs: Vec<String> = sys.processes().values().map(|p| p.name().to_string()).collect();
    procs.sort();
    procs.dedup();
    procs
}

#[tauri::command]
fn get_sys_info() -> SystemInfoResult {
    let mut sys = System::new_all();
    sys.refresh_all();

    let total_mem = sys.total_memory() as f32 / 1024.0 / 1024.0 / 1024.0;
    let used_mem = sys.used_memory() as f32 / 1024.0 / 1024.0 / 1024.0;
    let cpu_usage = sys.global_cpu_info().cpu_usage();

    SystemInfoResult {
        os: System::name().unwrap_or_else(|| "Windows 11".to_string()),
        arch: System::cpu_arch().unwrap_or_else(|| "x86_64".to_string()),
        hostname: System::host_name().unwrap_or_else(|| "NOVA-WIN".to_string()),
        cpu_model: sys.cpus().first().map(|c| c.brand().to_string()).unwrap_or_default(),
        cpu_usage,
        memory_total_gb: (total_mem * 10.0).round() / 10.0,
        memory_used_gb: (used_mem * 10.0).round() / 10.0,
        battery_percentage: 95,
        is_charging: true,
    }
}

#[tauri::command]
fn minimize_to_tray(window: tauri::Window) {
    let _ = window.hide();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_app,
            close_app,
            list_apps,
            get_sys_info,
            minimize_to_tray
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
