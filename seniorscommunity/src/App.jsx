import React from 'react'
import RootPage from './components/RootPage'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signin from './components/Signin'
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path={"/"} element={<RootPage/>}/>
        <Route path={"/signin"} element={<Signin/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App