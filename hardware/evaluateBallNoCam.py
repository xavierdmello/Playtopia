import cv2
import numpy as np
import time
import subprocess

blueSize = 70
blueCupTopLeftCorner = (190, 190)
blueCupBottomRightCorner = (blueCupTopLeftCorner[0] + blueSize, blueCupTopLeftCorner[1] + blueSize)

redSize = 45
redCupTopLeftCorner = (415, 177)
redCupBottomRightCorner = (redCupTopLeftCorner[0] + redSize, redCupTopLeftCorner[1] + redSize)

teeSize = 90
teeTopLeftCorner = (285, 365)
teeBottomRightCorner = (teeTopLeftCorner[0] + teeSize, teeTopLeftCorner[1] + teeSize)


def evaluatePoints(x, y):
    print("Evaluating points at", x, "and", y)

    if (blueCupTopLeftCorner[0] <= x <= blueCupBottomRightCorner[0]) and \
            (blueCupTopLeftCorner[1] <= y <= blueCupBottomRightCorner[1]):
        print("BLUE POINTS :D")
    elif (redCupTopLeftCorner[0] <= x <= redCupBottomRightCorner[0]) and \
            (redCupTopLeftCorner[1] <= y <= redCupBottomRightCorner[1]):
        print("RED POINTS :D")
    else:
        print("No points.")


def startCamera():
    # For webcam input
    cap = cv2.VideoCapture(0)

    width = 640
    height = 480

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

    # Define HSV range for orange color
    lower_orange = np.array([10, 100, 150])
    upper_orange = np.array([25, 255, 255])

    # FFmpeg command to stream to Kick
    stream_key = "sk_us-west-2_hUmvyNVPpiYJ_XTs3J1AqoSxyX9cWk0ca1ligFJSMoK"  # Replace with your Kick stream key
    ffmpeg_command = [
        "ffmpeg",
        "-y",
        "-f", "rawvideo",
        "-pix_fmt", "bgr24",
        "-s", f"{width}x{height}",
        "-r", "30",
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-f", "flv",
        f"rtmp://live.restream.io/live/{stream_key}"
    ]

    # Start FFmpeg process
    ffmpeg_process = subprocess.Popen(
        ffmpeg_command, stdin=subprocess.PIPE, stderr=subprocess.PIPE
    )

    # Time variables
    stoppedDuration = 3
    stoppedThreshold = 10  # Wiggle room to decide how "still" something can be
    readTime = None
    initialCoordinate = None

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            continue

        # Convert frame to HSV color space
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # Create a mask for orange color
        mask = cv2.inRange(hsv, lower_orange, upper_orange)

        # Remove noise using morphological operations
        mask = cv2.erode(mask, None, iterations=2)
        mask = cv2.dilate(mask, None, iterations=2)

        # Find contours in the mask
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        cv2.rectangle(frame, blueCupTopLeftCorner, blueCupBottomRightCorner, (255, 0, 0), 3)
        cv2.rectangle(frame, redCupTopLeftCorner, redCupBottomRightCorner, (0, 0, 255), 3)

        if contours:
            # Find the largest contour
            largest_contour = max(contours, key=cv2.contourArea)
            if cv2.contourArea(largest_contour) > 75:
                (x, y), radius = cv2.minEnclosingCircle(largest_contour)
                currentCoordinate = (int(x), int(y))
                radius = int(radius)

                # Draw the circle and center on the frame
                cv2.circle(frame, currentCoordinate, radius, (0, 255, 0), 2)
                cv2.circle(frame, currentCoordinate, 5, (0, 0, 255), -1)

                print(f"Ball detected at: {currentCoordinate}, Radius: {radius}")

                if initialCoordinate is not None:
                    initialx = initialCoordinate[0]
                    initialy = initialCoordinate[1]
                    currx = currentCoordinate[0]
                    curry = currentCoordinate[1]

                    lbx = initialx - stoppedThreshold
                    upbx = initialx + stoppedThreshold
                    lby = initialy - stoppedThreshold
                    upby = initialy + stoppedThreshold

                    if (currx > lbx and currx < upbx and curry > lby and curry < upby) and not (
                            teeTopLeftCorner[0] <= x <= teeBottomRightCorner[0] and
                            teeTopLeftCorner[1] <= y <= teeBottomRightCorner[1]):
                        duration = time.time() - readTime
                        if stoppedDuration <= duration < stoppedDuration + 3:
                            evaluatePoints(currx, curry)
                            readTime = None
                            initialCoordinate = None
                            input("Press Enter to Continue")

                    else:
                        readTime = time.time()
                        initialCoordinate = currentCoordinate
                else:
                    readTime = time.time()
                    initialCoordinate = currentCoordinate
        else:
            initialCoordinate = None
            readTime = None

        # Write frame to FFmpeg
        if ffmpeg_process.poll() is None:  # Check if FFmpeg is still running
            try:
                ffmpeg_process.stdin.write(frame.tobytes())
            except BrokenPipeError:
                print("BrokenPipeError: FFmpeg process terminated.")
                break
        else:
            print("FFmpeg process terminated unexpectedly.")
            break

    cap.release()
    ffmpeg_process.stdin.close()
    ffmpeg_process.wait()
    cv2.destroyAllWindows()


def main():
    startCamera()


if __name__ == "__main__":
    main()
