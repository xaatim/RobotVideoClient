import serial
import time


def readserial(comport, baudrate, timestamp=False):

    ser = serial.Serial(comport, baudrate, timeout=0.1)         # 1/timeout is the frequency at which the port is read

    while True:
        data = ser.readline().decode('utf-8').strip()
        # print(data)

        if data and timestamp:
            timestamp = time.strftime('%H:%M:%S')
            print(f'{timestamp} > {data}')
        elif data:
            print(data)


if __name__ == '__main__':

    readserial('COM9', 115200, True)                          # COM port, Baudrate, Show timestamp