from time import sleep
import zmq
import cv2
import subprocess
import json

subprocess.run(['raspistill', '-t', '2000', '-o', '/home/vlftjd/GPS_module/image.jpg', '-w', '600', '-h', '600', '-q', '50'])

sleep(5)
# zmq 컨텍스트 생성
context = zmq.Context()

# 소켓 생성
socket = context.socket(zmq.REQ)
socket.connect("tcp://192.168.219.129:12345")
# 이미지 로드
img = cv2.imread("image.jpg")
# 이미지 인코딩 및 송신
sleep(5)
_, img_str = cv2.imencode(".jpg", img)
socket.send(img_str)


socket = context.socket(zmq.REP)
socket.bind("tcp://0.0.0.0:54321")

sign = socket.recv_string()

# 결과값 예시 (딕셔너리 형태로 가정)
result_data = {
    "sign": sign
}

# 결과값을 JSON 형태로 변환
json_data = json.dumps(result_data)  # indent는 가독성을 위해 사용되며 선택 사항입니다.

# JSON 데이터를 파일로 저장
with open('predict.json', 'w') as file:
    file.write(json_data)
