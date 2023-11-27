import './App.css';
import data from './data/data.json'; // 더미데이터 DB 불러오기
import { useEffect } from 'react';


function distance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance between the two points in kilometers
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const MyLocation = {
  latitude: 36.352087984022205,
  longitude: 127.30028523386005,
};




function App() {
  const new_script = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.addEventListener('load', () => {
        resolve();
      });
      script.addEventListener('error', (e) => {
        reject(e);
      });
      document.head.appendChild(script);
    });
  };
  // 카카오맵 라이브러리 가져오기
  useEffect(() => {
    const initializeMap = async () => {
      const kakao = window.kakao;
      await new_script(
        'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=8cd203fb8326a745f18faf8e43268481'
      );

      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = //내 좌표값 설정 (가운데 정렬)
        {
          center: new kakao.maps.LatLng(36.352087984022205, 127.30028523386005),
          level: 3,
        };
        const map = new kakao.maps.Map(mapContainer, options);
        // 태그밑 이미지 설정
        data.addresses.forEach(({ latitude, longitude, name, image }) => {
          const markerPosition = new kakao.maps.LatLng(latitude, longitude);
          const markerImage = image ? new kakao.maps.MarkerImage(image, new kakao.maps.Size(50, 50)) : null;  // 이미지 띄우기
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            title: name, // 이름 추가
            image: markerImage  // 이미지 추가
          });
          const markerDistance = distance(MyLocation.latitude, MyLocation.longitude, latitude, longitude);
          // console.log(`Distance to ${name}: ${markerDistance.toFixed(2)} km`);
          // 내위치와 태그위치 거리를 계산하여 내위치가 아니고 태그와 가까울 때 밑의 코드가 실행
          if (markerDistance.toFixed(2) < 0.05 && name !== "내위치") {
            console.log(`${name} 사진을 찍을 수 있습니다.`);
          }

          // 태그 띄우는 부분
          marker.setMap(map);
        });
      });
    };

    initializeMap();
  }, []);

  return (
    <div className="App">
      <div id="map" className="map"></div>
    </div>
  );
}

export default App;
