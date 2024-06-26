import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import FindPoint from './pages/FindPoint';
import ViewPoints from './pages/ViewPoints';
import Details from './pages/Details';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<CreatePoint />} path="/create-point" />
        <Route element={<FindPoint />} path="/find-point" />
        <Route element={<ViewPoints />} path="/view-points" />
        <Route element={<Details />} path="/points/:id" />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;