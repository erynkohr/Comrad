import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Admin from "./pages/Admin";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Report from "./pages/Report";
import ShowBuilder from "./pages/ShowBuilder";
import User from "./pages/User";

const App = () => (
  <Router>
    <div>
      <Nav />
      <Switch>
        <Route exact path="/" component={Admin} />
        <Route exact path="/" component={Calendar} />
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/" component={Library} />
        <Route exact path="/" component={Login} />
        <Route exact path="/" component={Report} />
        <Route exact path="/" component={ShowBuilder} />
        <Route exact path="/" component={User} />
      </Switch>
    </div>
  </Route
);

export default App;

