import React from 'react';
import {Routes, Route, HashRouter, Navigate} from "react-router-dom";
import './App.css';
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import {SshConfiguration} from "./components/SshConfiguration";
import {SshTerminal} from "./components/SshTerminal";

function App() {
  return (
      <div className="App">
        <HashRouter>
            <Routes>
                <Route path='/login' element={<Login />}></Route>
                <Route path="/" element={<Navigate to="/index/configuration"/>}></Route>
                <Route path="/index" element={<Layout />}>
                    <Route path='/index/configuration' element={<SshConfiguration />} ></Route>
                    <Route path='/index/terminal' element={<SshTerminal />} ></Route>
                </Route>
            </Routes>
        </HashRouter>
      </div>
  );
}

export default App;
