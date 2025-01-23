import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sos from './sos'; // Importing the login component 'sos.js'
import App_1 from './App_1'; // Importing the todo app component 'App_1.js'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Sos />} /> {/* Login Component */}
        <Route path="/home" element={<App_1 />} /> {/* Todo App Component */}
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();