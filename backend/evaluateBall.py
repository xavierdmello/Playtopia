import cv2
import numpy as np
import time

def evaluatePoints(x, y):
    print("Evaluating points at", x, "and", y)

def startCamera():
    # For webcam input
    cap = cv2.VideoCapture(0)

    # Define HSV range for orange color
    lower_orange = np.array([10, 150, 150])  # Adjust as needed
    upper_orange = np.array([25, 255, 255])  # Adjust as needed

    # Time variables
    stoppedDuration = 3
    stoppedThreshold = 10 # Wiggle room to decide how "still" something can be
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


        if contours:
            # Find the largest contour
            largest_contour = max(contours, key=cv2.contourArea)
            if cv2.contourArea(largest_contour) > 500:  # Adjust minimum area if needed
                # Get the center and radius of the ball
                (x, y), radius = cv2.minEnclosingCircle(largest_contour)
                currentCoordinate = (int(x), int(y))
                radius = int(radius)

                # Draw the circle and center on the frame
                cv2.circle(frame, currentCoordinate, radius, (0, 255, 0), 2)
                cv2.circle(frame, currentCoordinate, 5, (0, 0, 255), -1)

                # Print the location
                print(f"Ball detected at: {currentCoordinate}, Radius: {radius}")


                ###
                # WOULD NEED A READ DELAY COUNTER or some way to not read a ball more than once after it's
                # already been counted.
                
                # For now, no threshold. Just straight up equal the same coordinate.
                if initialCoordinate is not None:
                
                    initialx = initialCoordinate[0]
                    initialy = initialCoordinate[1]
                    currx = currentCoordinate[0]
                    curry = currentCoordinate[1]
                    
                    lbx = initialx - stoppedThreshold
                    upbx = initialx + stoppedThreshold
                    lby = initialy - stoppedThreshold
                    upby = initialy + stoppedThreshold
                    
                    
                    if (currx > lbx and currx < upbx and curry > lby and curry < upby):
                        if (time.time() - readTime >= stoppedDuration):

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



        cv2.imshow('Camera Here :D', frame)

        # Quit if user presses "Esc"
        if cv2.waitKey(5) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


def main():
    startCamera()



if __name__ == "__main__":
    main()
