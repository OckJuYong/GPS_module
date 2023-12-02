import React, { useState, useEffect } from 'react';

const test = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
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

    fetchData();
  }, []); // 빈 의존성 배열은 컴포넌트가 마운트될 때 한 번만 실행되도록 보장합니다.

  return (
    <div>
      <h1>Flask와 React 통합</h1>
      <p>Flask 서버로부터의 결과: {result}</p>
    </div>
  );
};

export default test;