import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './pages/home';
import Message from './pages/message';
import Setting from './pages/setting';
import PageNotFound from './pages/404';
import About from './pages/about';
import Header from './components/header';
import Footer from './components/footer';
import {UserProvider} from './lib/context';
import './index.css';


ReactDOM.render(
    <UserProvider>
        <BrowserRouter>
            <Header />
            <Switch>
                <Route exact path='/'>
                    <Home />
                </Route>
                <Route exact path='/message'>
                    <Message />
                </Route>
                <Route exact path='/setting'>
                    <Setting />
                </Route>
                <Route exact path='/about'>
                    <About />
                </Route>
                <Route component={PageNotFound} />
            </Switch>
            <Footer />
        </BrowserRouter>
    </UserProvider>,
    document.getElementById('root')
);
