const SETTINGS_STORAGE_KEY = 'tom_itech_settings';

function loadAllSettings() {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
}

function saveAllSettings(settings) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

function getDeviceSettings(deviceKey) {
    const allSettings = loadAllSettings();
    return allSettings[deviceKey] || null;
}

function saveDeviceSettings(deviceKey, settings) {
    const allSettings = loadAllSettings();
    allSettings[deviceKey] = settings;
    saveAllSettings(allSettings);
}

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const configureButtons = document.querySelectorAll('.configure-btn');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const settingsForm = document.getElementById('settingsForm');
  const modalCloseBtn = modal.querySelector('.modal-close');
  const addBtn = document.querySelector('.add-btn');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const esp32IP = localStorage.getItem('esp32_ip') || '';
      const newIP = prompt('Masukkan IP Address ESP32 Anda (contoh: 192.168.1.100):', esp32IP);
      if (newIP !== null && newIP.trim() !== '') {
        localStorage.setItem('esp32_ip', newIP.trim());
        alert('IP ESP32 berhasil disimpan: ' + newIP.trim());
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tabContents.forEach(c => {
        c.classList.remove('active');
        c.hidden = true;
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panelId = tab.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('active');
        panel.hidden = false;
      }
    });
  });

  const deviceSettings = {
    temperatureSensor: {
      title: "Temperature Sensor Settings",
      fields: [
        {label: "Min Temperature Alert (°C)", type: "number", name: "minTempAlert", min: -20, max: 50, step: 0.1, value: 15},
        {label: "Max Temperature Alert (°C)", type: "number", name: "maxTempAlert", min: -20, max: 50, step: 0.1, value: 35},
        {label: "Sampling Interval (seconds)", type: "number", name: "samplingInterval", min: 5, max: 3600, value: 60},
        {label: "Enable Alerts", type: "checkbox", name: "enableAlerts", checked: true}
      ]
    },
    humiditySensor: {
      title: "Humidity Sensor Settings",
      fields: [
        {label: "Min Humidity Alert (%)", type: "number", name: "minHumidityAlert", min: 0, max: 100, step: 1, value: 30},
        {label: "Max Humidity Alert (%)", type: "number", name: "maxHumidityAlert", min: 0, max: 100, step: 1, value: 80},
        {label: "Sampling Interval (seconds)", type: "number", name: "samplingInterval", min: 5, max: 3600, value: 80},
        {label: "Enable Alerts", type: "checkbox", name: "enableAlerts", checked: false}
      ]
    },
    soilMoistureSensor: {
      title: "Soil Moisture Sensor Settings",
      fields: [
        {label: "Min Moisture Alert (%)", type: "number", name: "minMoistureAlert", min: 0, max: 100, step: 1, value: 20},
        {label: "Max Moisture Alert (%)", type: "number", name: "maxMoistureAlert", min: 0, max: 100, step: 1, value: 80},
        {label: "Sampling Interval (seconds)", type: "number", name: "samplingInterval", min: 5, max: 3600, value: 120},
        {label: "Enable Alerts", type: "checkbox", name: "enableAlerts", checked: true}
      ]
    },
    irrigationPump: {
      title: "Irrigation Pump Settings",
      fields: [
        {label: "Pump Duration (minutes)", type: "number", name: "pumpDuration", min: 1, max: 60, value: 10},
        {label: "Auto Irrigation Moisture Level (%)", type: "number", name: "autoIrrigationLevel", min: 0, max: 100, value: 30},
        {label: "Pump Start Time", type: "text", name: "pumpStartTime", placeholder: "HH:mm", value: "06:00"},
        {label: "Enable Auto Mode", type: "checkbox", name: "enableAutoMode", checked: true}
      ]
    },
    ventilationFan: {
      title: "Ventilation Fan Settings",
      fields: [
        {label: "Fan Speed (%)", type: "number", name: "fanSpeed", min: 0, max: 100, value: 50},
        {label: "Auto Fan Temp Trigger (°C)", type: "number", name: "autoFanTempTrigger", min: 20, max: 50, value: 30},
        {label: "Operating Hours", type: "text", name: "operatingHours", placeholder: "HH:mm-HH:mm", value: "08:00-18:00"},
        {label: "Enable Auto Mode", type: "checkbox", name: "enableAutoMode", checked: false}
      ]
    },
    networkSettings: {
      title: "Network Settings",
      fields: [
        {label: "ESP32 IP Address", type: "text", name: "esp32IP", placeholder: "192.168.1.100", value: ""},
        {label: "WiFi SSID", type: "text", name: "wifiSSID", value: "GreenHouse_WiFi"},
        {label: "WiFi Password", type: "password", name: "wifiPassword", value: ""},
        {label: "Auto-Refresh Interval (seconds)", type: "number", name: "refreshInterval", min: 1, max: 60, value: 5}
      ]
    },
    notificationAlerts: {
      title: "Notification Alert Settings",
      fields: [
        {label: "Email Alerts", type: "checkbox", name: "emailAlerts", checked: true},
        {label: "SMS Alerts", type: "checkbox", name: "smsAlerts", checked: false},
        {label: "Push Notifications", type: "checkbox", name: "pushNotifications", checked: true},
        {label: "Alert Sound", type: "checkbox", name: "alertSound", checked: true},
        {label: "Alert Cooldown (minutes)", type: "number", name: "alertCooldown", min: 1, max: 60, value: 5}
      ]
    }
  };

  configureButtons.forEach(button => {
    button.addEventListener('click', () => {
      const deviceKey = button.getAttribute('data-device');
      if(!deviceSettings[deviceKey]) return;

      settingsForm.innerHTML = '';
      modalTitle.textContent = deviceSettings[deviceKey].title;

      const savedDeviceSettings = getDeviceSettings(deviceKey);

      deviceSettings[deviceKey].fields.forEach(field => {
        const label = document.createElement('label');
        label.setAttribute('for', field.name);
        label.textContent = field.label;

        let input;
        let savedValue = savedDeviceSettings ? savedDeviceSettings[field.name] : undefined;

        if (field.type === 'checkbox') {
          input = document.createElement('input');
          input.type = 'checkbox';
          input.name = field.name;
          input.id = field.name;
          
          if (savedValue !== undefined) {
            input.checked = savedValue;
          } else if (field.checked) {
            input.checked = true;
          }

          label.prepend(input);
          settingsForm.appendChild(label);
        } else {
          input = document.createElement('input');
          input.type = field.type;
          input.name = field.name;
          input.id = field.name;
          
          if (savedValue !== undefined) {
            input.value = savedValue;
          } else if (field.value !== undefined) {
            input.value = field.value;
          }
          
          if (field.placeholder) input.placeholder = field.placeholder;
          if(field.min !== undefined) input.min = field.min;
          if(field.max !== undefined) input.max = field.max;
          if(field.step !== undefined) input.step = field.step;

          settingsForm.appendChild(label);
          settingsForm.appendChild(input);
        }
      });

      const saveBtn = document.createElement('button');
      saveBtn.type = 'submit';
      saveBtn.className = 'save-btn';
      saveBtn.textContent = 'Save Settings';
      settingsForm.appendChild(saveBtn);

      settingsForm.dataset.device = deviceKey;

      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');

      setTimeout(() => {
        settingsForm.querySelector('input:not([type=hidden])')?.focus();
      }, 100);
    })
  });

  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    settingsForm.innerHTML = '';
  };

  modalCloseBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if(e.target === modal) {
      closeModal();
    }
  });

  settingsForm.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(settingsForm);
    const deviceKey = settingsForm.dataset.device;

    const savedSettings = {};
    deviceSettings[deviceKey].fields.forEach(field => {
      if (field.type === 'checkbox') {
        savedSettings[field.name] = formData.has(field.name);
      } else {
        savedSettings[field.name] = formData.get(field.name);
      }
    });

    saveDeviceSettings(deviceKey, savedSettings);

    if (deviceKey === 'networkSettings' && savedSettings.esp32IP) {
      localStorage.setItem('esp32_ip', savedSettings.esp32IP);
    }

    const successMessage = document.createElement('div');
    successMessage.style.cssText = 'background: #32CD32; color: white; padding: 10px; border-radius: 8px; margin-bottom: 10px; text-align: center; font-weight: bold;';
    successMessage.textContent = '✅ Settings saved successfully!';
    settingsForm.insertBefore(successMessage, settingsForm.firstChild);

    if (deviceKey === 'networkSettings') {
      setTimeout(() => {
        closeModal();
        showArduinoCode(savedSettings);
      }, 1500);
    } else {
      setTimeout(() => {
        closeModal();
      }, 1500);
    }
  });

  const searchBox = document.getElementById('searchBox');
  searchBox.addEventListener('input', () => {
    const query = searchBox.value.toLowerCase();
    const activeTabContent = document.querySelector('.tab-content.active');
    if (!activeTabContent) return;

    activeTabContent.querySelectorAll('.setting-card').forEach(card => {
      const name = card.dataset.name.toLowerCase();
      if(name.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });

  function showArduinoCode(networkSettings) {
    const ssid = networkSettings.wifiSSID || 'YOUR_WIFI_SSID';
    const password = networkSettings.wifiPassword || 'YOUR_WIFI_PASSWORD';
    const ip = networkSettings.esp32IP || '192.168.1.100';

    const arduinoCode = `// ESP32 WiFi Configuration
// Copy this code to your ESP32 Arduino sketch

#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "${ssid}";
const char* password = "${password}";

WebServer server(80);

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  Serial.println("");
  Serial.println("Connecting to WiFi...");
  Serial.print("SSID: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  Serial.println("");
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.println("Configure this IP in TOM_iTECH Dashboard Network Settings");
  } else {
    Serial.println("WiFi connection failed!");
    Serial.println("Please check SSID and password");
  }
  
  // Your sensor setup code here...
}

void loop() {
  // Your sensor reading code here...
}

// Expected IP from settings: ${ip}
// Make sure to update the dashboard with the actual IP shown in Serial Monitor`;

    const codeModal = document.createElement('div');
    codeModal.className = 'modal show';
    codeModal.style.cssText = 'display: flex; position: fixed; z-index: 2000; left: 0; top: 0; width: 100vw; height: 100vh; background: rgba(0, 128, 0, 0.9); backdrop-filter: blur(5px); justify-content: center; align-items: center; padding: 1rem;';
    
    const codeContent = document.createElement('div');
    codeContent.style.cssText = 'background: linear-gradient(135deg, #228B22, #32CD32); border: 2px solid #FFFF00; border-radius: 15px; width: 100%; max-width: 700px; max-height: 80vh; padding: 2rem; box-shadow: 0 0 25px #FFFF00; position: relative; color: #e7defc; overflow-y: auto;';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = 'position: absolute; top: 12px; right: 15px; background: transparent; border: none; color: #e7defc; font-size: 2rem; cursor: pointer; transition: color 0.3s ease;';
    closeBtn.onmouseover = () => closeBtn.style.color = '#FFFF00';
    closeBtn.onmouseout = () => closeBtn.style.color = '#e7defc';
    closeBtn.onclick = () => document.body.removeChild(codeModal);
    
    const title = document.createElement('h2');
    title.textContent = '📋 ESP32 Arduino Code';
    title.style.cssText = 'margin-bottom: 1rem; text-align: center; color: #FFFF00;';
    
    const description = document.createElement('p');
    description.textContent = 'Copy this code to your ESP32 Arduino sketch:';
    description.style.cssText = 'margin-bottom: 1rem; color: #90EE90; text-align: center;';
    
    const codeArea = document.createElement('textarea');
    codeArea.value = arduinoCode;
    codeArea.readOnly = true;
    codeArea.style.cssText = 'width: 100%; height: 350px; background: #1e1e1e; color: #dcdcdc; border: 1px solid #32CD32; border-radius: 8px; padding: 15px; font-family: "Courier New", monospace; font-size: 13px; line-height: 1.5; resize: vertical;';
    
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy to Clipboard';
    copyBtn.style.cssText = 'background: linear-gradient(90deg, #32CD32, #90EE90); border: none; color: white; padding: 0.8rem 1.5rem; font-weight: 700; border-radius: 8px; cursor: pointer; width: 100%; font-size: 1rem; margin-top: 1rem; transition: background-color 0.3s ease;';
    copyBtn.onmouseover = () => copyBtn.style.background = 'linear-gradient(90deg, #FFFF00, #FFD700)';
    copyBtn.onmouseout = () => copyBtn.style.background = 'linear-gradient(90deg, #32CD32, #90EE90)';
    copyBtn.onclick = () => {
      codeArea.select();
      document.execCommand('copy');
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => {
        copyBtn.textContent = '📋 Copy to Clipboard';
      }, 2000);
    };
    
    const note = document.createElement('p');
    note.innerHTML = `<strong>Note:</strong> Upload this code to ESP32, then check the Serial Monitor for the actual IP address. Update the Network Settings with the real IP if different from expected: <code style="background: #1e1e1e; padding: 2px 6px; border-radius: 4px; color: #FFFF00;">${ip}</code>`;
    note.style.cssText = 'margin-top: 1rem; font-size: 0.9rem; color: #c8cdd7; text-align: center;';
    
    codeContent.appendChild(closeBtn);
    codeContent.appendChild(title);
    codeContent.appendChild(description);
    codeContent.appendChild(codeArea);
    codeContent.appendChild(copyBtn);
    codeContent.appendChild(note);
    codeModal.appendChild(codeContent);
    document.body.appendChild(codeModal);
    
    codeArea.select();
  }
});
