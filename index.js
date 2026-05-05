```javascript
// Medication Reminder App - Node.js
// Ejecutar con: node index.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Data persistence file
const DATA_FILE = path.join(__dirname, 'reminders.json');

// Medication Reminder App Class
class MedicationReminderApp {
  constructor() {
    this.reminders = this.loadReminders();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // Load reminders from file
  loadReminders() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.log('Iniciando con recordatorios vacíos...');
    }
    return [];
  }

  // Save reminders to file
  saveReminders() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.reminders, null, 2));
    } catch (error) {
      console.error('Error guardando recordatorios:', error.message);
    }
  }

  // Add new medication reminder
  addReminder(medication, dosage, time, frequency) {
    const reminder = {
      id: Date.now(),
      medication,
      dosage,
      time,
      frequency,
      createdAt: new Date(),
      lastTaken: null,
      active: true
    };
    this.reminders.push(reminder);
    this.saveReminders();
    console.log(`\n✓ Recordatorio agregado: ${medication} - ${dosage} a las ${time}\n`);
  }

  // List all reminders
  listReminders() {
    if (this.reminders.length === 0) {
      console.log('\n✗ No hay recordatorios registrados\n');
      return;
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📋 RECORDATORIOS DE MEDICAMENTOS');
    console.log('═══════════════════════════════════════════════════════════');
    
    this.reminders.forEach((reminder, index) => {
      const status = reminder.active ? '✓ ACTIVO' : '✗ INACTIVO';
      const lastTaken = reminder.lastTaken 
        ? new Date(reminder.lastTaken).toLocaleString() 
        : 'Nunca';
      
      console.log(`\n${index + 1}. ${reminder.medication}`);
      console.log(`   Dosis: ${reminder.dosage}`);
      console.log(`   Hora: ${reminder.time}`);
      console.log(`   Frecuencia: ${reminder.frequency}`);
      console.log(`   Estado: ${status}`);
      console.log(`   Última toma: ${lastTaken}`);
      console.log(`   ID: ${reminder.id}`);
    });
    console.log('\n═══════════════════════════════════════════════════════════\n');
  }

  // Mark medication as taken
  markAsTaken(id) {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.lastTaken = new Date();
      this.saveReminders();
      console.log(`\n✓ ${reminder.medication} marcado como tomado a las ${new Date().toLocaleTimeString()}\n`);
    } else {
      console.log('\n✗ Recordatorio no encontrado\n');
    }
  }

  // Delete reminder
  deleteReminder(id) {
    const index = this.reminders.findIndex(r => r.id === id);
    if (index > -1) {
      const medication = this.reminders[index].medication;
      this.reminders.splice(index, 1);
      this.saveReminders();
      console.log(`\n✓ ${medication} eliminado de recordatorios\n`);
    } else {
      console.log('\n✗ Recordatorio no encontrado\n');
    }
  }

  // Toggle reminder active status
  toggleReminder(id) {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.active = !reminder.active;
      this.saveReminders();
      const status = reminder.active ? 'activado' : 'desactivado';
      console.log(`\n✓ ${reminder.medication} ${status}\n`);
    } else {
      console.log('\n✗ Recordatorio no encontrado\n');
    }
  }

  // Check for upcoming reminders
  checkUpcomingReminders() {
    const now = new Date();
    const currentHour = String(now.getHours()).padStart(2, '0');
    const currentMinute = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;

    const upcoming = this.reminders.filter(r => r.active && r.time === currentTime);
    
    if (upcoming.length > 0) {
      console.log('\n🚨 ¡ALERTAS DE MEDICAMENTOS! 🚨');
      console.log('═══════════════════════════════════════════════════════════');
      upcoming.forEach(reminder => {
        console.log(`⚠️  Es hora de tomar: ${reminder.medication}`);
        console.log(`   Dosis: ${reminder.dosage}`);
        console.log(`   Frecuencia: ${reminder.frequency}`);
      });
      console.log('═══════════════════════════════════════════════════════════\n');
      return true;
    }
    return false;