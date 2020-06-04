import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import Locate from './pages/Locate';
import Register from './pages/Register';

const Routes = () => (
	<BrowserRouter>
		<Route component={Home} path="/" exact />
		<Route component={Locate} path="/locate" />
		<Route component={Register} path="/register" />
	</BrowserRouter>
)

export default Routes;