import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Import Navigate
import PrivateRoute from "./utils/PrivateRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import Transaction from "./components/Transaction";
import Categories from "./components/Categories";
import Navbar from "./components/Navbar";
import Goals from "./components/Goals";


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Navbar></Navbar>
                <Dashboard />
                {/* <Goals></Goals> */}
                {/* <Transaction /> */}
                {/* <Categories/> */}
              </PrivateRoute>
            }
          />
          <Route path="/transactions" element={<Transaction />} />  
          <Route path="/goals" element={<Goals/>}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
