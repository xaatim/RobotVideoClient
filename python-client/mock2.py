import os
import sys
import socketio
import cv2
import subprocess

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

# Use ffmpeg to encode raw OpenCV frames -> H264 fragmented MP4
ffmpeg = subprocess.Popen([
    'ffmpeg',
    '-f', 'rawvideo',
    '-pix_fmt', 'bgr24',
    '-s', f"{int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))}x{int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))}",
    '-r', '30',
    '-i', '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-f', 'mp4',
    '-movflags', 'frag_keyframe+empty_moov+default_base_moof',  # ✅ important!
    'pipe:1'
], stdin=subprocess.PIPE, stdout=subprocess.PIPE)


def send_chunk(chunk):
    io.emit('frame', {'robotId': robot_id, 'frame': chunk})

io.connect(
    'http://localhost:4000',
    auth={'robotId': robot_id, 'robotKey': robot_key}
)

try:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        # feed raw frame into ffmpeg
        ffmpeg.stdin.write(frame.tobytes()) # pyright: ignore[reportOptionalMemberAccess]

        # read encoded mp4 chunks
        chunk = ffmpeg.stdout.read(4096) # type: ignore
        if chunk:
            send_chunk(chunk)

    cap.release()
    io.wait()
except KeyboardInterrupt:
    ffmpeg.kill()
    sys.exit(0)
