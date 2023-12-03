import gpsd
import json


gpsd.connect(host="localhost", port=2947)

packet =gpsd.get_current()
print(f"latitude: {packet.lat}, longitude: {packet.lon}")


# 결과값 예시 (딕셔너리 형태로 가정)
result_data = {
    "latitude": packet.lat, 
    "longitude": packet.lon
}

# 결과값을 JSON 형태로 변환
json_data = json.dumps(result_data)  # indent는 가독성을 위해 사용되며 선택 사항입니다.

# JSON 데이터를 파일로 저장
with open('gps.json', 'w') as file:
    file.write(json_data)