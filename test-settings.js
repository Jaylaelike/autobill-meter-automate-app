#!/usr/bin/env node

/**
 * Test script to verify settings file creation and reading
 */

const fs = require("fs");
const path = require("path");

const SETTINGS_FILE = path.join(__dirname, "monitor-settings.json");

console.log("🧪 Testing Settings File");
console.log("========================\n");

console.log("Settings file path:", SETTINGS_FILE);
console.log("File exists:", fs.existsSync(SETTINGS_FILE));

if (fs.existsSync(SETTINGS_FILE)) {
  console.log("\n📄 Current settings:");
  const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
  const settings = JSON.parse(data);
  console.log(JSON.stringify(settings, null, 2));
  
  console.log("\n⏱️  Intervals in seconds:");
  console.log(`  DB Save Interval: ${settings.dbSaveInterval / 1000}s`);
  console.log(`  Update Rate: ${settings.updateRate / 1000}s`);
  console.log(`  Connection Timeout: ${settings.connectionTimeout / 1000}s`);
  console.log(`  Reconnect Interval: ${settings.reconnectInterval / 1000}s`);
  console.log(`  Max Reconnect Attempts: ${settings.maxReconnectAttempts}`);
} else {
  console.log("\n⚠️  No settings file found. Using defaults.");
  console.log("   Create settings from the frontend Settings page.");
}

console.log("\n✅ Test complete");
