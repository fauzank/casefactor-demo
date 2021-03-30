import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch } from 'react-router-dom';
import NotFound from './not-found/not-found'
import './App.css'
import { withAuthenticator } from '@aws-amplify/ui-react';
import EmployeeDetail from './employee/employeeDetail'
import Case from './case/case'
import Exhibit from './exhibit/exhibit'
import MovementComp from './movement/movement'
import HomePage from './homepage/homepage'
import ExtractTextPage from './textpage/textpage'

 function App() {
  return (
    <div className="App"> 
      <div id="wrapper"> 
        <div>
          <Switch>
            <Route exact path={["/", "/defaultPath"]} component={HomePage} />
            <Route exact path={["/employee"]} component={EmployeeDetail} />
            <Route exact path={["/case"]} component={Case} />
            <Route exact path={["/exhibit/:eid"]} component={Exhibit} />
            <Route exact path={["/movement/:exid"]} component={MovementComp} />
            <Route exact path={["/textpage/:xid"]} component={ExtractTextPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
