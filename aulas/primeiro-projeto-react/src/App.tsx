import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GlobaStyle from './styles/global';

import Routes from './routes';

const App: React.FC = () => (
  <>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
    <GlobaStyle />
  </>
);

export default App;
