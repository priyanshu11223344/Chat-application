import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Loginsignup/Loginsignup'
import Chat from './chat/chat'
import ProtectedRoute from './Components/ProtectedRoute'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkAuth } from './redux/auth/authThunk'
import ChatLandingPage from './Components/ChatLandingPage'
function App() {
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(checkAuth());
  },[])
  return (
    <>
    <Router>
    <Routes>
      <Route path="/" element={<ChatLandingPage/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<Chat />} />
      </Route>
    </Routes>
    </Router>
    </>
  )
}

export default App
