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
  pivotServo.write(90); // Middle position (corresponds to 0 in your range of -40 to 40)
  swingServo.write(0);  // Starting position for swing
}

void loop() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    int pivot = 0;

    // Parse pivot command from serial input
    if (sscanf(command.c_str(), "P:%d", &pivot) == 1) {
      if (pivot >= -40 && pivot <= 40) {
        // Map the pivot range (-40 to 40) to servo range (50 to 130)
        int servoAngle = map(pivot, -40, 40, 50, 130);
        pivotServo.write(servoAngle); // Move the pivot servo to the specified angle
      }
    }

    // Trigger swing if "SWING" command is received
    if (command == "SWING") {
      swingServo.write(120); // Move swing servo to 120 degrees
      delay(200); // Pause briefly at the top position

      // Swing back to 0 degrees
      for (int angle = 120; angle >= 0; angle -= 5) {
        swingServo.write(angle);
        delay(10); // Small delay for smoother motion
      }

      // After swinging, pivot back to 0
      delay(200);
      pivotServo.write(90); // Reset pivot servo to middle position
    }
  }
}
