import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './pages/home';
import Trending from './pages/trending';
import Setting from './pages/setting';
import PageNotFound from './pages/404';
import About from './pages/about';
import Header from './components/header';
import Footer from './components/footer';
import {AppContext, UserProvider, AppProvider} from './components/context';
import './index.css';


ReactDOM.render(
    <AppProvider>
    <UserProvider>
        <BrowserRouter>
            <Header />
            <Switch>
                <Route exact path='/' component={() => <Home op={0} />}/>
                <Route exact path='/posts' component={() => <Home op={1} />}/>
                <Route exact path='/marks' component={() => <Home op={2} />}/>
                <Route exact path='/trending' component={Trending} />
                <Route exact path='/setting' component={Setting} />
                <Route exact path='/about' component={About} />
                <Route component={PageNotFound} />
            </Switch>
            <Footer />
        </BrowserRouter>
    </UserProvider>
    </AppProvider>,
    document.getElementById('root')
);
