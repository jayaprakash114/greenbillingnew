import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainContent from './components/MainContent'
function Home() {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="d-flex">
      <Sidebar showSidebar={showSidebar} />
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: showSidebar ? '250px' : '0', transition: 'margin-left 0.3s ease' }}>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="flex-grow-1">
        <MainContent />
        </div>
      </div>
      
    </div>
  );
}

export default Home;
