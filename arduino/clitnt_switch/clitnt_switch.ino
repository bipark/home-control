#include <stdio.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

const char* ssid = "rtlink";
const char* password = "1111111110";

ESP8266WebServer server(80);
WiFiClient client;
IPAddress server1(192,168,0,10);

const int led = 12;

void handleRoot() {
  server.send(200, "text/plain", "Hello from Billy");
}

void handleOn(){
  digitalWrite(led, HIGH); 
  server.send(200, "text/plain", "Switch On");
}

void handleOff(){
  digitalWrite(led, LOW); 
  server.send(200, "text/plain", "Switch Off");
}

void handleStatus(){
  char buffer[1];
  sprintf(buffer, "%01d", digitalRead(led));
  server.send(200, "text/plain", buffer);
}

void setup(void){
  pinMode(led, OUTPUT);

  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (client.connect(server1, 3000)) {
    Serial.println("Connect OK........");

    char buffer[100];
    // 디바이스 스위치 번호 & 이름을 서버로 전송한다.
    sprintf(buffer, "GET /regist?number=2&ip=%s&name=SecondSW HTTP/1.0", WiFi.localIP().toString().c_str()); 
    
    client.println(buffer);
    client.println();
  }

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  server.on("/", handleRoot);
  server.on("/on", handleOn);
  server.on("/off", handleOff);
  server.on("/status", handleStatus);

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void){
  server.handleClient();
}
