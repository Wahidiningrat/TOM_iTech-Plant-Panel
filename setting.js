document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const configureButtons = document.querySelectorAll('.configure-btn');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const settingsForm = document.getElementById('settingsForm');
  const modalCloseBtn = modal.querySelector('.modal-close');

  // Tab switching logic
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs and hide content
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tabContents.forEach(c => {
        c.classList.remove('active');
        c.hidden = true;
      });

      // Activate selected tab and show content
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

  // Device settings definition (form fields)
  const deviceSettings = {
    temperatureSensor: {
      title: "Temperature Sensor Settings",
      fields: [
        {label: "Temperature Threshold (°C)", type: "number", name: "tempThreshold", min: -20, max: 50, step: 0.1, value: 25},
        {label: "Sampling Interval (seconds)", type: "number", name: "samplingInterval", min: 5, max: 3600, value: 60},
        {label: "Enable Alerts", type: "checkbox", name: "enableAlerts", checked: true}
      ]
    },
    humiditySensor: {
      title: "Humidity Sensor Settings",
      fields: [
        {label: "Humidity Threshold (%)", type: "number", name: "humidityThreshold", min: 0, max: 100, step: 1, value: 60},
        {label: "Sampling Interval (seconds)", type: "number", name: "samplingInterval", min: 5, max: 3600, value: 80},
        {label: "Enable Alerts", type: "checkbox", name: "enableAlerts", checked: false}
      ]
    },
    soilMoistureSensor: {
      title: "Soil Moisture Sensor Settings",
      fields: [
        {label: "Moisture Threshold (%)", type: "number", name: "moistureThreshold", min: 0, max: 100, step: 1, value: 40},
        {label: "Sampling Interval (seconds)", type: "number", name: "samplingInterval", min: 5, max: 3600, value: 120},
        {label: "Enable Alerts", type: "checkbox", name: "enableAlerts", checked: true}
      ]
    },
    irrigationPump: {
      title: "Irrigation Pump Settings",
      fields: [
        {label: "Pump Duration (minutes)", type: "number", name: "pumpDuration", min: 1, max: 60, value: 10},
        {label: "Pump Start Time", type: "text", name: "pumpStartTime", placeholder: "HH:mm", value: "06:00"},
        {label: "Enable Schedule", type: "checkbox", name: "enableSchedule", checked: true}
      ]
    },
    ventilationFan: {
      title: "Ventilation Fan Settings",
      fields: [
        {label: "Fan Speed (%)", type: "number", name: "fanSpeed", min: 0, max: 100, value: 50},
        {label: "Operating Hours", type: "text", name: "operatingHours", placeholder: "HH:mm-HH:mm", value: "08:00-18:00"},
        {label: "Enable Auto Mode", type: "checkbox", name: "enableAutoMode", checked: false}
      ]
    },
    networkSettings: {
      title: "Network Settings",
      fields: [
        {label: "WiFi SSID", type: "text", name: "wifiSSID", value: "GreenHouse_WiFi"},
        {label: "WiFi Password", type: "password", name: "wifiPassword", value: ""},
        {label: "DHCP Enabled", type: "checkbox", name: "dhcpEnabled", checked: true}
      ]
    },
    notificationAlerts: {
      title: "Notification Alert Settings",
      fields: [
        {label: "Email Alerts", type: "checkbox", name: "emailAlerts", checked: true},
        {label: "SMS Alerts", type: "checkbox", name: "smsAlerts", checked: false},
        {label: "Push Notifications", type: "checkbox", name: "pushNotifications", checked: true},
        {label: "Alert Threshold (minutes delay)", type: "number", name: "alertThreshold", min: 1, max: 60, value: 5}
      ]
    }
  };

  // Open modal with form for device settings
  configureButtons.forEach(button => {
    button.addEventListener('click', () => {
      const deviceKey = button.getAttribute('data-device');
      if(!deviceSettings[deviceKey]) return;

      // Clear previous form
      settingsForm.innerHTML = '';

      // Set modal title
      modalTitle.textContent = deviceSettings[deviceKey].title;

      // Generate form fields
      deviceSettings[deviceKey].fields.forEach(field => {
        const label = document.createElement('label');
        label.setAttribute('for', field.name);
        label.textContent = field.label;

        let input;
        if (field.type === 'checkbox') {
          input = document.createElement('input');
          input.type = 'checkbox';
          input.name = field.name;
          input.id = field.name;
          if (field.checked) input.checked = true;

          label.prepend(input); // checkbox before label text
          settingsForm.appendChild(label);
        } else {
          input = document.createElement('input');
          input.type = field.type;
          input.name = field.name;
          input.id = field.name;
          if (field.value !== undefined) input.value = field.value;
          if (field.placeholder) input.placeholder = field.placeholder;
          if(field.min !== undefined) input.min = field.min;
          if(field.max !== undefined) input.max = field.max;
          if(field.step !== undefined) input.step = field.step;

          settingsForm.appendChild(label);
          settingsForm.appendChild(input);
        }
      });
      // Add Save button
      const saveBtn = document.createElement('button');
      saveBtn.type = 'submit';
      saveBtn.className = 'save-btn';
      saveBtn.textContent = 'Save Settings';
      settingsForm.appendChild(saveBtn);

      // Store current device key for submission
      settingsForm.dataset.device = deviceKey;

      // Show modal
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');

      // Focus first input
      setTimeout(() => {
        settingsForm.querySelector('input:not([type=hidden])')?.focus();
      }, 100);
    })
  });

  // Close modal function
  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    settingsForm.innerHTML = '';
  };

  modalCloseBtn.addEventListener('click', closeModal);

  // Close modal on outside click
  modal.addEventListener('click', e => {
    if(e.target === modal) {
      closeModal();
    }
  });

  // Handle form submission
  settingsForm.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(settingsForm);
    const deviceKey = settingsForm.dataset.device;

    // Example: Collect and show saved values in alert
    const savedSettings = {};
    deviceSettings[deviceKey].fields.forEach(field => {
      if (field.type === 'checkbox') {
        savedSettings[field.name] = formData.has(field.name);
      } else {
        savedSettings[field.name] = formData.get(field.name);
      }
    });

    alert(`Settings saved for ${deviceSettings[deviceKey].title}:\n` + 
          JSON.stringify(savedSettings, null, 2));

    closeModal();
  });

  // Optional: Simple search filter to show/hide cards by name on active tab
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
});
