import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Datashow from "./components/Datashow";
import Datashow2 from "./components/Datashow2";
import Navbar from "./components/Navbar";
import ImagePage from "./components/ImagePage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import ChangePassword from "./components/Changepassword";
import ResetPassword from "./components/Resetpassword";


function App() {
  return (
    <Router>
      <Navbar />

      <div className="p-4">
        <Switch>
          <Route exact path="/" render={() => <div>Select a data view from above.</div>} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/change-password" component={ChangePassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/datashow" component={Datashow} />
          <PrivateRoute path="/datashow2" component={Datashow2} />
          <PrivateRoute path="/image" component={ImagePage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
