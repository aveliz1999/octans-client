import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from "./components/login/Login";
import {UserContext} from "./context/User";
import React, {useContext} from "react";

export default function AppRouter() {
    const [user] = useContext(UserContext);

    return <Router>
        <Switch>
            {
                user ? <>
                    {
                        // TODO implement authenticated routing
                    }
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