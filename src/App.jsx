import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Datashow from "./components/Datashow";
import Datashow2 from "./components/Datashow2";
import Navbar from "./components/Navbar";
import ImagePage from "./components/ImagePage"; 
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Navbar />

      <div className="p-4">
        <Switch>
          <Route exact path="/" render={() => <div>Select a data view from above.</div>} />
          <Route path="/datashow" component={Datashow} />
          <Route path="/datashow2" component={Datashow2} />
          <Route path="/image" component={ImagePage} /> 
          <Route path="/login" component={LoginPage} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
