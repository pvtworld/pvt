import React from 'react'
import {Route, Redirect, Switch, BrowserRouter} from 'react-router-dom';
import Login from './Components/Login';
import firebase from './Firebase/firebase';
import LandingPage from './Components/LandingPage';
import NotFound from './Components/NotFound';
import GameContainer from './Components/GameContainer';

function PublicRoute ({component: Component, authed, ...rest}) {
    return (
        <Route {...rest} render={(props) => authed === false
            ? <Component {...props} />
            : <Redirect to='/game' />}
        />
    )
}

function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest} render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
        />
    )
}

export default class App extends React.Component {
    constructor(){
        super();
        this.state = {
            authed: false
        }
    }
    componentDidMount () {
        this.removeListener = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authed: true
                });
                console.log('User IS auth');
            } else {
                this.setState({
                    authed: false
                });
                console.log('User NOT auth');
            }
        })
    }
    componentWillUnmount () {
        this.removeListener()
    }
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/' exact component={LandingPage} />
                    <PublicRoute authed={this.state.authed} path='/login' component={Login} />
                    <PrivateRoute authed={this.state.authed} path='/game' component={GameContainer} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}