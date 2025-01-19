import serial
import time

# Configuration constants
SERIAL_PORT = '/dev/ttyACM0'  # Adjust to match your system's serial port
BAUD_RATE = 9600

# Initialize serial connection
def initialize_serial_connection():
    try:
        connection = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print(f"Connected to Arduino on {SERIAL_PORT}")
        time.sleep(2)  # Wait for Arduino to reset
        return connection
    except serial.SerialException as e:
        print(f"Error: {e}")
        exit()

# Send pivot command to Arduino
def send_pivot_command(connection, pivot):
    try:
        if -40 <= pivot <= 40:  # Adjust to match the Arduino's accepted range
            command = f"P:{pivot}\n"
            connection.write(command.encode())
            print(f"Sent to Arduino: {command.strip()}")
        else:
            print("Invalid pivot angle. Must be between -40 and 40.")
    except Exception as e:
        print(f"Failed to send pivot command: {e}")

# Send swing command to Arduino
def send_swing_command(connection):
    try:
        command = "SWING\n"
        connection.write(command.encode())
        print(f"Sent to Arduino: {command.strip()}")
    except Exception as e:
        print(f"Failed to send swing command: {e}")

# Main interaction loop
def main():

    arduino = initialize_serial_connection()
    try:
        while True:
            # Get pivot angle input
            try:
                pivot = int(input("Enter pivot angle (-40 to 40): "))
                send_pivot_command(arduino, pivot)
            except ValueError:
                print("Invalid input. Please enter a number.")

            # Check if swing command should be triggered
            swing_input = input("Trigger swing? (yes/no): ").strip().lower()
            if swing_input == "yes":
                send_swing_command(arduino)
            elif swing_input != "no":
                print("Invalid input. Please type 'yes' or 'no'.")

            time.sleep(0.5)  # Adjust delay as needed
    except KeyboardInterrupt:
        print("Exiting...")
    finally:
        arduino.close()
        print("Serial connection closed.")

# Run the script
if __name__ == "__main__":
    main()
