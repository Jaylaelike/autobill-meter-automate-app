#!/usr/bin/env node

/**
 * Import Modbus configuration from CSV file
 * Maps station names to their Modbus channel broadcaster names
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// CSV file path
const CSV_FILE = path.join(__dirname, '../../modbus.csv');

/**
 * Parse CSV file
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  console.log('📋 CSV Headers:', headers);
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || null;
    });
    data.push(row);
  }
  
  return data;
}

/**
 * Import modbus data to database
 */
async function importModbus() {
  console.log('\n🚀 Starting Modbus Import\n');
  
  try {
    // Parse CSV
    const modbusData = parseCSV(CSV_FILE);
    console.log(`📊 Parsed ${modbusData.length} stations from CSV`);
    
    // Import each station's modbus config
    console.log('💾 Starting database import...');
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const row of modbusData) {
      const stationName = row['station'];
      
      if (!stationName) {
        console.log(`⚠️  Skipping row with no station name`);
        skipCount++;
        continue;
      }
      
      // Find station in database
      const station = await prisma.station.findUnique({
        where: { name: stationName }
      });
      
      if (!station) {
        console.log(`⚠️  Station not found: ${stationName}`);
        skipCount++;
        continue;
      }
      
      // Prepare modbus data
      const modbusConfig = {
        stationId: station.id,
        modbus1: row['Modbus 1'] || null,
        modbus2: row['Modbus 2'] || null,
        modbus3: row['Modbus 3'] || null,
        modbus4: row['Modbus 4'] || null,
        modbus5: row['Modbus 5'] || null,
        modbus6: row['Modbus 6'] || null,
      };
      
      // Upsert modbus config
      await prisma.stationModbus.upsert({
        where: { stationId: station.id },
        update: modbusConfig,
        create: modbusConfig,
      });
      
      const channels = [
        modbusConfig.modbus1,
        modbusConfig.modbus2,
        modbusConfig.modbus3,
        modbusConfig.modbus4,
        modbusConfig.modbus5,
        modbusConfig.modbus6,
      ].filter(Boolean);
      
      console.log(`✅ ${stationName}: ${channels.length} modbus channels (${channels.join(', ')})`);
      successCount++;
    }
    
    console.log(`\n📊 Import Summary:`);
    console.log(`   - Stations imported: ${successCount}`);
    console.log(`   - Stations skipped: ${skipCount}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    throw error;
  }
}

/**
 * Verify imported data
 */
async function verifyImport() {
  console.log('\n🔍 Verifying imported data...\n');
  
  const modbusConfigs = await prisma.stationModbus.findMany({
    include: {
      station: {
        select: { name: true }
      }
    },
    orderBy: {
      station: { name: 'asc' }
    }
  });
  
  console.log('📋 Modbus Configurations:');
  for (const config of modbusConfigs) {
    const channels = [
      config.modbus1 ? `1:${config.modbus1}` : null,
      config.modbus2 ? `2:${config.modbus2}` : null,
      config.modbus3 ? `3:${config.modbus3}` : null,
      config.modbus4 ? `4:${config.modbus4}` : null,
      config.modbus5 ? `5:${config.modbus5}` : null,
      config.modbus6 ? `6:${config.modbus6}` : null,
    ].filter(Boolean);
    
    console.log(`   ${config.station.name}: [${channels.join(', ')}]`);
  }
  
  console.log(`\n✅ Total: ${modbusConfigs.length} stations with modbus config`);
}

/**
 * Main execution
 */
async function main() {
  const command = process.argv[2] || 'import';
  
  try {
    if (command === 'import') {
      await importModbus();
      await verifyImport();
      console.log('\n✅ Import completed successfully!');
    } else if (command === 'verify') {
      await verifyImport();
    } else {
      console.log('Usage: node import-modbus.js [import|verify]');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
