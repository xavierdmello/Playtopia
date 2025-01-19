from flask import Flask, jsonify, request
from controller import initialize_serial_connection, send_pivot_command, send_swing_command
import threading
import evaluateBallNoCam
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize Arduino connection globally
# arduino = initialize_serial_connection()

# Start camera thread
camera_thread = threading.Thread(target=evaluateBallNoCam.startCamera, args=(None,))
camera_thread.daemon = True  # Make thread exit when main program exits
camera_thread.start()

@app.route('/shoot', methods=['POST'])
def shoot():
    try:
        # Get heading from request
        data = request.get_json()
        heading = data.get('heading')
        
        if heading is None:
            return jsonify({'error': 'heading is required'}), 400
            
        # Validate heading range
        if not -40 <= heading <= 40:
            return jsonify({'error': 'heading must be between -40 and 40'}), 400
        
        # Send pivot command
        # send_pivot_command(arduino, heading)
        print(f"Pivot command sent: {heading}")
        
        # Wait for pivot to complete
        time.sleep(1)
        
        # Send swing command
        # TODO: send_swing_command(arduino)
        print("Swing command sent")
        
        return jsonify({'message': 'Shot executed successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    try:
        # Run Flask app on port 5001
        app.run(host='0.0.0.0', port=5001)
    finally:
        pass
    #     # Clean up Arduino connection when server stops
    #     arduino.close()
