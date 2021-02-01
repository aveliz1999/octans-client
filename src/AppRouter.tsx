import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from "./components/login/Login";
import {UserContext} from "./context/User";
import React, {useContext} from "react";
import Gallery from "./components/gallery/Gallery";
import Home from "./components/home/Home";

export default function AppRouter() {
    const [user] = useContext(UserContext);

    return <Router>
        <Switch>
            {
                user ? <>
                    <Route exact path="/home">
                        <Home/>
                    </Route>
                    <Route path="/">
                        <Redirect to="/home"/>
                    </Route>
                </> : <>
                    <Route exact path="/login">
                        <Login/>
                    </Route>
                    <Route path="/">
                        <Redirect to="/login"/>
                    </Route>
                </>
            }
        </Switch>
    </Router>
}