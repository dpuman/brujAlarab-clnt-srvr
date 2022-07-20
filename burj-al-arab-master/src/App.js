import React, { createContext, useState } from 'react';
import './App.css';
import {
  Routes,

  Route
} from "react-router-dom";
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Book from './components/Book/Book';
import Header from './components/Header/Header';
import RequireAuth from './components/RequireAuth/RequireAuth';


export const UserContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState({})
  return (
    <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
      <Header />
      <p>Name: {loggedInUser.name}</p>
      <Routes>


        <Route path="/home" element={<Home />} />


        <Route path="/login" element={<Login />} />


        <Route path="/book/:bedType" element={
          <RequireAuth>
            <Book />
          </RequireAuth>
        } />


        <Route exact path="/" element={<Home />} />



      </Routes>
    </UserContext.Provider>
  );
}

export default App;
