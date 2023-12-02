from time import sleep
import zmq
import cv2
import subprocess

# subprocess.run(['raspistill', '-t', '2000', '-o', '/home/vlftjd/GPS_module/image.jpg', '-w', '600', '-h', '600', '-q', '50'])

# sleep(5)
# zmq 컨텍스트 생성
context = zmq.Context()

# 소켓 생성
socket = context.socket(zmq.REQ)
socket.connect("tcp://192.168.219.159:12345")
# 이미지 로드
img = cv2.imread("image.jpg")
# 이미지 인코딩 및 송신
sleep(5)
_, img_str = cv2.imencode(".jpg", img)
socket.send(img_str)


socket = context.socket(zmq.REP)
socket.bind("tcp://0.0.0.0:54321")

sign = socket.recv_string()
print(sign)

# context = zmq.Context()

# # 소켓 생성
# socket = context.socket(zmq.REQ)
# socket.bind("tcp://192.16:8.219.110:5555")


