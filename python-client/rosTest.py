import os
import sys
import socketio
import cv2
import time

io = socketio.Client()

@io.event
def connect():
    print("Connected to server.")

@io.event
def disconnect():
    print("Disconnected from server.")

video_path = r"D:\Career Projects\ros2hatim\python-client\test.mp4"
cap = cv2.VideoCapture(video_path)

robot_id = os.getenv("robotId")
robot_key = os.getenv("robotKey")

print(robot_id,robot_key)
def shutdown(any):
    pass
def send_frame(frame):
    _, buf = cv2.imencode('.jpg', frame)
    io.emit('frame', {'robotId': robot_id, 'frame': buf.tobytes()})
    io.on("shutdonw",shutdown)
    # print(buf.tobytes())

io.connect(
    'http://localhost:4000',
    auth={'robotId': robot_id, 'robotKey': robot_key}
)
try:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
        send_frame(frame)
        time.sleep(1/60)

    cap.release()
    io.wait()
except KeyboardInterrupt:
    sys.exit(0)
