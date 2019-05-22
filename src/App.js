import React from 'react';
import { BrowserRouter, Route,Switch } from 'react-router-dom'
import Purchase from './pages/purchase'
import Pay from './pages/pay'
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/purchase" component={Purchase} />
        <Route path="/pay" component={Pay}/> 
      </Switch>
    </BrowserRouter>    
  );
}

export default App;
