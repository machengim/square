import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './pages/home';
import Setting from './pages/setting';
import About from './pages/about';
import PageNotFound from './pages/404';
import Header from './components/header';
import Footer from './components/footer';
import {UserProvider, AppProvider} from './components/context';
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
                <Route exact path='/search/:keyword' component={() => <Home op={3} />}/>
                <Route exact path='/trending' component={() => <Home op={4} />} />
                <Route exact path='/setting' component={Setting} />
                <Route exact path='/about/:type' component={About} />
                <Route component={PageNotFound} />
            </Switch>
            <Footer />
        </BrowserRouter>
    </UserProvider>
    </AppProvider>,
    document.getElementById('root')
);
