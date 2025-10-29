import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootPage from './components/RootPage';
import Signin from './components/Signin';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import Home from './pages/Home';
import Profilecard from './components/Profilecard';
import NotFound from './pages/NotFound';
// Blog Components
import BlogList from './pages/BlogList';
import CreateBlog from './pages/CreateBlog';
import BlogDetail from './pages/BlogDetail';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Existing Routes */}
          <Route path="/" element={<RootPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/profilecard" element={<Profilecard />} />
          <Route path="/home" element={<Home />} />
          
          {/* Blog Routes */}
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/edit-blog/:id" element={<CreateBlog />} />
          
          {/* 404 Not Found Route (Optional but recommended) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
