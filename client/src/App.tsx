import { hot } from 'react-hot-loader/root';
import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import './main.scss';

export default hot(() => (
  <BrowserRouter>
    <Switch>
      <Route path="/">
        Hello world!
      </Route>
    </Switch>
  </BrowserRouter>
)) as FC;
