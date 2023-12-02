import React, { useState, useEffect } from 'react';
import './App.css';
import data from './data/data.json';
import quz from './data/qu.json';


const myaddress = {
  latitude: 36.352087984022205,
  longitude: 127.30028523386005,
};

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function App() {
  const [result, setResult] = useState(null);

  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [isQuizVisible, setIsQuizVisible] = useState(false);
  const [MyLocation, setMyLocation] = useState({
    latitude: myaddress.latitude,
    longitude: myaddress.longitude,
  });

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

  const checkAnswer = (quiz, userAnswer) => {
    return quiz.answer === parseInt(userAnswer);
  };

  const getRandomQuiz = () => {
    const randomIndex = Math.floor(Math.random() * quz.S2art.length);
    return quz.S2art[randomIndex];
  };

  const handleQuizAnswer = () => {
    if (userAnswer !== '') {
      if (checkAnswer(currentQuiz, userAnswer)) {
        setIsAnswerCorrect(true);
      } else {
        setIsAnswerCorrect(false);
      }
    } else {
      setIsAnswerCorrect(null);
    }
  };

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleAnswerSubmit = () => {
    handleQuizAnswer();
  };

  useEffect(() => {
    const randomQuiz = getRandomQuiz();
    setCurrentQuiz(randomQuiz);
    const address = async () => {
      try {
        const response = await fetch('http://localhost:5001/gps');
        const address = await response.json();
        setMyLocation(    
          address.wido, address.ghyungdo);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        setResult(`오류: ${error.message}`);
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/capture-image');
        const data = await response.json();
        setResult(data.result);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        setResult(`오류: ${error.message}`);
      }
    };

    const initializeMap = async () => {
      const kakao = window.kakao;
      await new_script(
        'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=8cd203fb8326a745f18faf8e43268481'
      );

      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(MyLocation.latitude, MyLocation.longitude),
          level: 3,
        };
        const map = new kakao.maps.Map(mapContainer, options);

        data.addresses.forEach(({ latitude, longitude, name, image }) => {
          const markerPosition = new kakao.maps.LatLng(latitude, longitude);
          const markerImage = image ? new kakao.maps.MarkerImage(image, new kakao.maps.Size(50, 50)) : null;
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            title: name,
            image: markerImage
          });
          const markerDistance = distance(MyLocation.latitude, MyLocation.longitude, latitude, longitude);
          //  사진이랑 문제 가져오는 부분
          if (markerDistance.toFixed(2) < 0.05 && name !== "내위치" && name !== "imsi 내위치") {
            console.log(`${name} 사진을 찍을 수 있습니다.`);
            if (result === "yes") {
              setIsQuizVisible(true);
            }
          }

          marker.setMap(map);
        });
      });
    };

    const updateGPSLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMyLocation({
            latitude,
            longitude,
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    };

    // 최초 한 번 실행
    updateGPSLocation();

    // 주기적으로 위치 업데이트를 위한 setInterval 설정
    const gpsUpdateInterval = setInterval(updateGPSLocation, 10000);

    initializeMap();

    return () => clearInterval(gpsUpdateInterval);
  }, [MyLocation.latitude, MyLocation.longitude]);

  return (
    <div className="App">
      <div id="map" className="map"></div>
      <div>
        {isQuizVisible && currentQuiz && (
          <>
            <p>문제: {currentQuiz.question}</p>
            <input type="text" value={userAnswer} onChange={handleInputChange} />
            <button onClick={handleAnswerSubmit}>정답 확인</button>
            {isAnswerCorrect !== null && (
              <div>
                {isAnswerCorrect ? '정답입니다!' : '틀렸습니다!'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
    
  );
}

export default App;
