import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaMoneyBill, FaBox, FaUser } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

const Sidebar = ({ showSidebar }) => {
  return (
    <div
      className={`mt-2 p-5 sidebar ${showSidebar ? 'show' : 'hide'} custom-sidebar`}
      style={{
        marginLeft: "8px",
        width: '250px',
        minHeight: '98vh',
        position: 'fixed',
        top: 0,
        left: 0,
        transition: 'transform 0.3s ease',
        backgroundColor: '#f8f9fa', // Optional: You can add background color if needed
      }}
    >
      <h3 className="logo">CORPWINGS</h3>

      <nav className="flex-column" style={{ marginTop: "50px", marginLeft:"15px" }}>
        <Link to="/home" className="text-black mb-2 mt-3 customnav d-flex align-items-center">
          <FaHome className="li" /> Home
        </Link>
        <Link to="/billpage" className="text-black mb-2 customnav d-flex align-items-center">
          <FaMoneyBill className="li" /> BillList
        </Link>
        <Link to="/items" className="text-black mb-2 customnav d-flex align-items-center">
          <FaBox className="li" /> Items
        </Link>
        <Link to="/" className="text-black customnav d-flex align-items-center">
          <FaUser className="li" /> Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
