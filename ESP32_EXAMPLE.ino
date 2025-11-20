#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);

float soilMoisture = 0;
float temperature = 0;
float lightIntensity = 0;
float voltage = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("");
  Serial.println("========================================");
  Serial.println("  TOM_iTECH Plant Monitoring System");
  Serial.println("========================================");
  Serial.println("");
  
  Serial.println("Connecting to WiFi...");
  Serial.print("SSID: ");
  Serial.println(ssid);
  Serial.print("Password: ");
  for(int i = 0; i < strlen(password); i++) {
    Serial.print("*");
  }
  Serial.println("");
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  Serial.print("Status: ");
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  Serial.println("");
  Serial.println("");
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("✓ WiFi Connected Successfully!");
    Serial.println("----------------------------------------");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    Serial.println("----------------------------------------");
    Serial.println("");
    Serial.println("IMPORTANT:");
    Serial.println("1. Copy the IP address above");
    Serial.println("2. Open TOM_iTECH Dashboard");
    Serial.println("3. Go to Settings > Network");
    Serial.println("4. Paste the IP in 'ESP32 IP Address'");
    Serial.println("5. Click Save Settings");
    Serial.println("");
  } else {
    Serial.println("✗ WiFi Connection FAILED!");
    Serial.println("----------------------------------------");
    Serial.println("Troubleshooting:");
    Serial.println("1. Check WiFi SSID and password");
    Serial.println("2. Make sure router is on");
    Serial.println("3. Check WiFi signal strength");
    Serial.println("4. Reconfigure in TOM_iTECH Settings");
    Serial.println("----------------------------------------");
    return;
  }
  
  server.enableCORS(true);
  
  server.on("/data", HTTP_GET, handleDataRequest);
  
  server.begin();
  Serial.println("✓ HTTP Server Started");
  Serial.println("Waiting for dashboard requests...");
  Serial.println("========================================");
  Serial.println("");
}

void loop() {
  server.handleClient();
  
  readSensors();
  
  delay(100);
}

void readSensors() {
  soilMoisture = analogRead(34) / 40.95;
  
  temperature = 25.0 + (analogRead(35) / 4095.0) * 10.0;
  
  lightIntensity = analogRead(36) / 4.095;
  
  voltage = (analogRead(39) / 4095.0) * 3.3 * 5.0;
  
  static unsigned long lastPrint = 0;
  if (millis() - lastPrint > 5000) {
    Serial.println("Sensor Readings:");
    Serial.print("  Soil Moisture: ");
    Serial.print(soilMoisture, 1);
    Serial.println("%");
    Serial.print("  Temperature: ");
    Serial.print(temperature, 1);
    Serial.println("°C");
    Serial.print("  Light: ");
    Serial.print(lightIntensity, 1);
    Serial.println("%");
    Serial.print("  Voltage: ");
    Serial.print(voltage, 2);
    Serial.println("V");
    Serial.println("");
    lastPrint = millis();
  }
}

void handleDataRequest() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  
  String json = "{";
  json += "\"soilMoisture\":" + String(soilMoisture, 2) + ",";
  json += "\"temperature\":" + String(temperature, 2) + ",";
  json += "\"lightIntensity\":" + String(lightIntensity, 2) + ",";
  json += "\"voltage\":" + String(voltage, 2);
  json += "}";
  
  server.send(200, "application/json", json);
  
  Serial.println("✓ Data sent to dashboard");
}
