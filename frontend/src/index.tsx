import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './pages/home';
import Message from './pages/message';
import Setting from './pages/setting';
import About from './pages/about';
import Header from './components/header';
import './index.css';


ReactDOM.render(
    <BrowserRouter>
        <Header />
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/message">
                <Message />
            </Route>
            <Route exact path="/setting">
                <Setting />
            </Route>
            <Route exact path="/about">
                <About />
            </Route>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);