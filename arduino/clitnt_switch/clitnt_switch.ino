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
  server.send(200, "text/plain", "Hello from esp8266!");
}

void handleNotFound(){
  String message = "File Not Found\n\n";
  message += "URI : ";
  message += server.uri();
  message += "\nMethod : ";
  message += (server.method() == HTTP_GET)?"GET":"POST";
  message += "\nArguments : ";
  message += server.args();
  message += "\n";
  for (uint8_t i=0; i<server.args(); i++){
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
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
  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void){
  server.handleClient();
}
