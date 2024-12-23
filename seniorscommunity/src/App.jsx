import React from 'react'
import RootPage from './components/RootPage'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signin from './components/Signin'
import Main from './components/Main'
import Profile from './components/Profile'
import UserProfile from './components/UserProfile'
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path={"/"} element={<RootPage/>}/>
        <Route path={"/signin"} element={<Signin/>}/>
        <Route path={"/development"} element={<Main/>}/>
        <Route path={'/profile'} element={<Profile/>}/>
        <Route path={'/userprofile'} element={<UserProfile/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App