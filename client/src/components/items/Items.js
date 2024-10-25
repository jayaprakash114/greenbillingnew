import React, { useState } from 'react';
import './Items.css'
import ProductTable from '../products/ProductTable'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const Items = () => {
    const [showSidebar, setShowSidebar] = useState(true);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div className="d-flex">
            <Sidebar showSidebar={showSidebar} />
            <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: showSidebar ? '250px' : '0', transition: 'margin-left 0.3s ease' }}>
                {/* <Navbar toggleSidebar={toggleSidebar} /> */}
                <div className='custom-product-item'>
                    <ProductTable />
                </div>

            </div>
        </div>

    )
}

export default Items