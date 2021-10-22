import { hot } from 'react-hot-loader/root';
import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';

import '@@theme/main.scss';
import Login from '@@pages/Login/Login';

export default hot(() => (
  <BrowserRouter>
    <Switch>
      <Route path="/">
        <Login />
      </Route>
    </Switch>
  </BrowserRouter>
)) as FC;
