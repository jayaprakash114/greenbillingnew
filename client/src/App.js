import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import BillPage from './BillPage';
import Items from './components/items/Items';
import LoginPage from './LoginPage';
import './App.css';

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const signin = () => {
    setIsSignedIn(true);
  };

  const signout = () => {
    setIsSignedIn(false);
  };

  const ProtectedRoute = ({ children }) => {
    return isSignedIn ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage signin={signin} />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home signout={signout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billpage"
          element={
            <ProtectedRoute>
              <BillPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
