import cv2
import numpy as np
import time

blueSize = 70
blueCupTopLeftCorner = (190, 190)
blueCupBottomRightCorner = (blueCupTopLeftCorner[0]+blueSize, blueCupTopLeftCorner[1]+blueSize)

redSize = 60
redCupTopLeftCorner = (400, 190)
redCupBottomRightCorner = (redCupTopLeftCorner[0]+redSize, redCupTopLeftCorner[1]+redSize)

teeSize = 90
teeTopLeftCorner = (285, 365)
teeBottomRightCorner = (teeTopLeftCorner[0]+teeSize, teeTopLeftCorner[1]+teeSize)


def evaluatePoints(x, y):
    print("Evaluating points at", x, "and", y)

    if (blueCupTopLeftCorner[0] <= x and x <= blueCupBottomRightCorner[0]) and (blueCupTopLeftCorner[1] <= y and y <= blueCupBottomRightCorner[1]):
        print("BLUE POINTS :D")
    elif (redCupTopLeftCorner[0] <= x and x <= redCupBottomRightCorner[0]) and (redCupTopLeftCorner[1] <= y and y <= redCupBottomRightCorner[1]):
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
    #lower_orange = np.array([10, 150, 150])  # Adjust as needed
    #upper_orange = np.array([25, 255, 255])  # Adjust as needed
    lower_orange = np.array([10, 100, 150])  # Increased saturation and brightness thresholds
    upper_orange = np.array([25, 255, 255])  # Keep the upper limit wide for flexibility


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
        # 215, 100
        cv2.rectangle(frame, blueCupTopLeftCorner, blueCupBottomRightCorner, (255, 0, 0), 3)
        cv2.rectangle(frame, redCupTopLeftCorner, redCupBottomRightCorner, (0, 0, 255), 3)
        #cv2.rectangle(frame, teeTopLeftCorner, teeBottomRightCorner, (0, 255, 0), 3)
        # cv2.circle(frame, (400, 400), 50, (255, 0, 0), -1)


        ### Get frame dimensions
        #height, width, _ = frame.shape
        ## Calculate the square's coordinates
        # square_size = 100  # Length of square sides in pixels
        # top_left = (width // 2 - square_size // 2, height // 2 - square_size // 2)
        # bottom_right = (width // 2 + square_size // 2, height // 2 + square_size // 2)
        # cv2.rectangle(frame, top_left, bottom_right, (255, 0, 0), 2)


        if contours:
            # Find the largest contour
            largest_contour = max(contours, key=cv2.contourArea)
            if cv2.contourArea(largest_contour) > 10:  # Adjust minimum area if needed
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
                    
                    
                    if (currx > lbx and currx < upbx and curry > lby and curry < upby) and not (teeTopLeftCorner[0] <= x and x <= teeBottomRightCorner[0] and teeTopLeftCorner[1] <= y and y <= teeBottomRightCorner[1]):
                        duration = time.time() - readTime
                        if (duration >= stoppedDuration and duration < stoppedDuration+3):

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



        #cv2.imshow('Playtopia: Golf', frame)

        # Quit if user presses "Esc"
        if cv2.waitKey(5) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


def main():
    startCamera()



if __name__ == "__main__":
    main()
