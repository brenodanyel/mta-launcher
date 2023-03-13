#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use declarative_discord_rich_presence::{
    activity::Activity, activity::Assets, activity::Button, activity::Party, activity::Timestamps,
    DeclarativeDiscordIpcClient,
};

use std::{fs, panic};
use tauri::{Manager, State};

#[tauri::command]
fn set_discord_presence(
    discord_rich_presence_client: State<'_, DeclarativeDiscordIpcClient>,
    state: Option<String>,
    details: Option<String>,
    large_image: Option<String>,
    large_text: Option<String>,
    small_image: Option<String>,
    small_text: Option<String>,
    start_at: Option<i64>,
    current_players: Option<i32>,
    max_players: Option<i32>,
    server_ip: Option<String>,
    profile: Option<String>,
) {
    let mut activity = Activity::new();

    if let Some(state) = state {
        activity = activity.state(&state);
    }

    if let Some(details) = details {
        activity = activity.details(&details);
    }

    let mut assets = Assets::new();

    if let Some(large_image) = large_image {
        assets = assets.large_image(&large_image);
    }

    if let Some(large_text) = large_text {
        assets = assets.large_text(&large_text);
    }

    if let Some(small_image) = small_image {
        assets = assets.small_image(&small_image);
    }

    if let Some(small_text) = small_text {
        assets = assets.small_text(&small_text);
    }

    activity = activity.assets(assets);

    if let Some(start_at) = start_at {
        activity = activity.timestamps(Timestamps::new().start(start_at))
    }

    if let Some(current_players) = current_players {
        if let Some(max_players) = max_players {
            activity = activity.party(Party::new().size([current_players, max_players]));
        }
    }

    let mut buttons = vec![];

    if let Some(profile) = profile {
        buttons.push(Button::new("View Server".to_string(), profile.to_string()));
    } else {
        if let Some(server_ip) = server_ip {
            buttons.push(Button::new("Join".to_string(), server_ip.to_string()));
        }
    }

    buttons.push(Button::new(
        "Download the launcher".to_string(),
        "https://www.mta-launcher.com/".to_string(),
    ));

    activity = activity.buttons(buttons);

    let _result = panic::catch_unwind(|| {
        discord_rich_presence_client.enable();
        discord_rich_presence_client
            .set_activity(activity)
            .expect("Failed to set activity");
    });
}

#[tauri::command]
fn disable_rich_presence(discord_rich_presence_client: State<'_, DeclarativeDiscordIpcClient>) {
    discord_rich_presence_client.disable()
}

#[tauri::command]
fn read_config_file(path: &str) -> String {
    let contents = fs::read_to_string(path).expect("Should have been able to read the file");
    format!("{}", contents)
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let discord_rich_presence_client =
                DeclarativeDiscordIpcClient::new("1054073961694113843");
            discord_rich_presence_client.enable();
            app.manage(discord_rich_presence_client);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            read_config_file,
            disable_rich_presence,
            set_discord_presence
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
