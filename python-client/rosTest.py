import os
import sys
import socketio
import cv2
import time

io = socketio.Client(reconnection=True,reconnection_attempts=10,reconnection_delay=20)


@io.event
def connect():
    print("Connected to server.")


@io.event
def disconnect():
    print("Disconnected from server.")


# video_path = r"D:\Career Projects\ros2hatim\python-client\test.mp4"
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

robot_id = os.getenv("serialNo")
robot_key = os.getenv("robotKey")

print(robot_id, robot_key)


def controls(mode):
    print("Received control mode:", mode)


io.on("controlMode", controls)


def send_frame(frame):
    _, buf = cv2.imencode('.jpg', frame)
    io.emit('robot:frame',   buf.tobytes())


    # print(buf.tobytes())
io.connect(
    'http://localhost:4000',
    auth={'serialNo': "BR100-SN-0001", 'robotKey': '7zwf6wokpc9f0mgp1twz94'},
    
)
try:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
        send_frame(frame)
        time.sleep(1/60)

    io.wait()
except KeyboardInterrupt:
    print("exiting")
finally:
    io.disconnect()
    cap.release()
    
