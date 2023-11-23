// index.js

import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client'; // 이 부분을 수정합니다.

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<App />);
