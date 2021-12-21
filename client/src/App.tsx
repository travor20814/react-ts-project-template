import { hot } from 'react-hot-loader/root';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import '@@theme/main.scss';
import Login from '@@pages/Login/Login';

export default hot(() => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  </BrowserRouter>
)) as FC;
