import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatroom from './components/Chatroom';
import JoinForm from './components/JoinForm';
import GlobalStyle from './styles/GlobalStyle';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <>
    <GlobalStyle />
    <Router>
      <Routes>
        <Route path='/' element={<JoinForm />} />
        <Route path='/chatroom' element={<Chatroom />} />
      </Routes>
    </Router>
  </>
);
