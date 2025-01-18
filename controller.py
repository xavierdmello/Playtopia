import serial
import time

# Configure the serial port
SERIAL_PORT = '/dev/cu.usbmodem101'  
BAUD_RATE = 9600     

# Establish the serial connection
try:
    arduino = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    print(f"Connected to Arduino on {SERIAL_PORT}")
    time.sleep(2)  # Wait for Arduino to reset
except serial.SerialException as e:
    print(f"Error: {e}")
    exit()

# Send pivot command to Arduino
def send_pivot_command(pivot):
    # Construct the pivot command as a string, e.g., "P:<pivot>\n"
    command = f"P:{pivot}\n"
    arduino.write(command.encode())
    print(f"Sent to Arduino: {command.strip()}")

# Send swing command to Arduino
def send_swing_command():
    # Construct the swing command
    command = "SWING\n"
    arduino.write(command.encode())
    print(f"Sent to Arduino: {command.strip()}")

# Main loop
try:
    while True:
        # Example: Simulate joystick inputs or web app commands
        pivot = int(input("Enter pivot angle (0-180): "))  # User provides the pivot angle
        if 0 <= pivot <= 180:
            send_pivot_command(pivot)
        else:
            print("Invalid pivot angle. Must be between 0 and 180.")

        # Example: Trigger swing command based on user input
        swing_input = input("Trigger swing? (yes/no): ").strip().lower()
        if swing_input == "yes":
            send_swing_command()

        time.sleep(0.5)  # Adjust as needed
except KeyboardInterrupt:
    print("Exiting...")
finally:
    arduino.close()
    print("Serial connection closed.")