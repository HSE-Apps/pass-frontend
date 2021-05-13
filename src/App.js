import React, {useState, useEffect} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import axios from 'axios';

import Loading from './components/Loading';
import Navbar from './components/Navbar';

import AdminHome from './views/AdminHome';
import StudentHome from './views/StudentHome';
import Home from './views/Home';

import AuthContext from './auth/AuthContext';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Verify from './auth/Verify';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import Settings from './auth/Settings';

import {recentPasses} from './mockData'

import './App.css';


const App = () => {
  const [auth, setAuth] = useState({isAuth: false, loading: true, fetched: false})
  
  useEffect(() => {
    localStorage.setItem("passData", JSON.stringify(recentPasses))
  }, [])



  useEffect(() => {
    document.title = "HSE Template"

    if (!auth.user && !auth.fetched){
      console.log('test token')
      testToken()
    }
    if (auth.toFetch){
      testToken()
      console.log("hi there")
    }
    console.log(auth)

  }, [auth])

  const testToken = async () => {
    const token = localStorage.getItem('token')

    if(!token){
      setAuth({isAuth: false, loading: false, fetched: true})

    } else {
      axios.defaults.headers.common['Authorization'] =`Bearer ${token}`

      try{
        const res = await axios.get(`${process.env.REACT_APP_AUTH_API}/user/?timestamp=${new Date().getTime()}`)
        console.log(res.data)

        if (!res.data.errors){
          setAuth({isAuth: true, user: res.data, loading: false, fetched: true})

        } else {
          console.log("set to false")
          localStorage.removeItem("token")
          setAuth({isAuth: false, loading: false, fetched: true})
        }
      } catch (err) {
        localStorage.removeItem("token")
        console.log("set to false")
        setAuth({isAuth: false, loading: false, fetched: true})
      }
    }
  } 


  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      <BrowserRouter>

        <div className="App">
          

          <Switch>
            <Route exact path="/verify/:token" component={Verify}/>
            <Route exact path="/forgot-password" component={ForgotPassword}/>
            <Route exact path="/reset-password/:token" component={ResetPassword}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/signup" component={Signup}/>
            

            
            {auth.user?.role === "admin"?
              <div>
                <Navbar/>
                <Route exact path="/settings" component={Settings}/>
                <Route exact path="/" component={AdminHome}/>
              </div>
            :auth.user?.role === "teacher"?
              <div>
                {/* student routes */}
                <Navbar/>
                <Route exact path="/settings" component={Settings}/>
                <Route exact path="/" component={AdminHome}/>
              </div>
            :auth.user?.role === "student"?
              <div>
                {/* student routes */}
                <Navbar/>
                <Route exact path="/settings" component={Settings}/>
                <Route exact path="/" component={StudentHome}/>
              </div>
            :
              <div>
                {/* other routes */}
                <Navbar/>
                <Route exact path="/" component={Home}/>
              </div>
            }
          </Switch>
        </div>


      </BrowserRouter>
    </AuthContext.Provider>
  )
}
export default App;
