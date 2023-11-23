import './App.css';
import { useEffect } from 'react';

function App() {

  
  // 스크립트 파일 읽어오기
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

  useEffect(() => {

    
    
    // 카카오맵 스크립트 읽어오기
    const my_script = new_script(
      'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=8cd203fb8326a745f18faf8e43268481'
    );
  
    // 스크립트 읽기 완료 후 카카오맵 설정
    my_script.then(() => {
      console.log('script loaded!!!');
      const kakao = window.kakao;
      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(36.352087984022205, 127.30028523386005),
          level: 3,
        };
        const map = new kakao.maps.Map(mapContainer, options);
  
        // 이미지의 경로 설정
        const imageSrc = '/images/kakao_Img.png';
        const imagesrc = '/images/kim.jpg';
  
        // 마커 랜드마크 태그 설정
        const markerimage = new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(50, 50));
        const marker_image = new kakao.maps.MarkerImage(imagesrc, new kakao.maps.Size(50, 50));
        const markerPosition1 = new kakao.maps.LatLng(36.35120, 127.3017);
        const markerPosition2 = new kakao.maps.LatLng(36.34987, 127.2981);

        // 내 위치 태그
        const myposition = new kakao.maps.LatLng(36.352087984022205, 127.30028523386005);
  
        const marker1 = new kakao.maps.Marker({
          position: markerPosition1,
          image: markerimage,
        });
  
        const marker2 = new kakao.maps.Marker({
          position: markerPosition2,
          image: marker_image,
        });

        const my_marker = new kakao.maps.Marker({
          position: myposition
        });
  
        marker1.setMap(map);
        marker2.setMap(map);
        my_marker.setMap(map);
      });
    });
  }, []);

  return (
    <div className="App">
      <div id="map" className="map"></div>
    </div>
  );
}

export default App;
