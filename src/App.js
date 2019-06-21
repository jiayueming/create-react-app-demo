import React from 'react';
import { BrowserRouter, Route,Switch } from 'react-router-dom'
import Purchase from './pages/purchase'
import Pay from './pages/pay'
import Property from './pages/property'
import PropertyDetail from './pages/property-detail'
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Purchase} />
        <Route path="/pay" component={Pay}/>
        <Route path="/property" component={Property} />
        <Route path="/propertyDetail" component={PropertyDetail} />
      </Switch>
    </BrowserRouter>    
  );
}

export default App;
