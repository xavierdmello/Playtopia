#include <Servo.h>

#define PIVOT_SERVO_PIN 6
#define SWING_SERVO_PIN 9

Servo pivotServo;
Servo swingServo;

void setup() {
  Serial.begin(9600);

  // Attach the servos to their pins
  pivotServo.attach(PIVOT_SERVO_PIN);
  swingServo.attach(SWING_SERVO_PIN);

  // Initialize the servos to their default positions
  pivotServo.write(90); 
  swingServo.write(0);  // Starting position for swing
}

void loop() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    int pivot = 0;

    // Parse pivot command from serial input
    if (sscanf(command.c_str(), "P:%d", &pivot) == 1) {
      if (pivot >= 0 && pivot <= 180) {
        pivotServo.write(pivot); // Move the pivot servo to the specified angle
      }
    }

    // Trigger swing if "SWING" command is received
    if (command == "SWING") {
      swingServo.write(120); //hardcoded to 120
      delay(200); // Pause at the top
      for (int angle = 120; angle >= 0; angle -= 5) { // Swing back
        swingServo.write(angle);
        delay(10);
      }
    }
  }
}
