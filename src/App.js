import './App.css';
import data from './data/data.json';
import { useEffect } from 'react';

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

  useEffect(() => {
    const initializeMap = async () => {
      const kakao = window.kakao;
      await new_script(
        'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=8cd203fb8326a745f18faf8e43268481'
      );

      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(36.352087984022205, 127.30028523386005),
          level: 3,
        };
        const map = new kakao.maps.Map(mapContainer, options);

        data.addresses.forEach(({ latitude, longitude, name, image }) => {
          const markerPosition = new kakao.maps.LatLng(latitude, longitude);
          const markerImage = image ? new kakao.maps.MarkerImage(image, new kakao.maps.Size(50, 50)) : null;
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            title: name, // 이름 추가
            image: markerImage
          });

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
