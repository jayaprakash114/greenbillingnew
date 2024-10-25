import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Container, Form } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BillPage.css';
import logo from './logoUrl.png'; // Import the logo image

const BillPage = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReversed, setIsReversed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Set to today's date
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bills');
        console.log('Fetched bills:', response.data);
        setBills(response.data);
        filterBills(selectedDate, searchTerm); // Filter bills with initial date
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    fetchBills();
  }, []); // Empty dependency array to run once on component mount

  useEffect(() => {
    filterBills(selectedDate, searchTerm); // Filter bills whenever selectedDate or searchTerm changes
  }, [selectedDate, searchTerm, bills]); // Add bills to dependencies to filter when data is fetched

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };

  const handlePrint = (bill) => {
  const logoUrl = logo;
  const createdAt = new Date(bill.createdAt).toLocaleString();

  const printWindow = window.open('', '', 'height=600,width=800');
  const printContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print Bill</title>
  </head>
  <style>
  td, th {
    text-align: center;
    padding: 6px;
  }
  h3, h6 {
    text-align: center;
  }
  #amt {
    margin-top: 30px;
  }
  img {
    width: 230px;
    margin-left: 20px;
    margin-bottom: -50px;
  }
  .footer {
    text-align: center;
    margin-top: 20px;
    font-size: 12px;
    color: #555;
  }
  </style>
  <body>
    <div>
    
     <h1 style="font-size: 42px; font-weight: 800; margin: 0; padding: 0; text-align: center;">
    GREEN NATURALS
</h1>
<h4 style="font-weight: 900; margin-top: 8px; letter-spacing: 0px; text-align: center;">
    31, Rajendra Singh Street,<br>
    Chunambupet, Gudiyatham.<br>
    Phone: 9600399287.
</h4>


      <h3>Bill for ${bill.customerName}</h3> <!-- Displaying customer name here -->
      <h3>Bill Amount</h3>
      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Service</th>
            <th>Price</th>
            
            
          </tr>
        </thead>
        <tbody>
          ${bill.selectedProducts.map((product, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${product.name}</td>
              <td>₹${product.price.toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="2">Total:</td>
            <td><b>₹${bill.totalAmount.toFixed(2)}</b></td>
          </tr>
        </tbody>
      </table>
      <p>${createdAt}</p>
      <div class="footer">
      Billed by CORPWINGS
    </div>
    </div>
  </body>
  </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

const handlePrintFilteredBills = () => {
  if (filteredBills.length === 0) {
    alert('No bills found for the selected date.');
    return;
  }

  const printWindow = window.open('', '', 'height=600,width=800');
  const printContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print Filtered Bills</title>
  </head>
  <style>
  td, th {
    text-align: center;
    padding: 6px;
  }
  h3, h6 {
    text-align: center;
  }
  #amt {
    margin-top: 30px;
  }
  img {
    width: 230px;
    margin-left: 20px;
    margin-bottom: -50px;
  }
  .footer {
    text-align: center;
    margin-top: 20px;
    font-size: 12px;
    color: #555;
  }
  </style>
  <body>
    <div>
    

         <h1 style="font-size: 42px; font-weight: 800; margin: 0; padding: 0; text-align: center;">
    GREEN NATURALS
</h1>
<h4 style="font-weight: 900; margin-top: 8px; letter-spacing: 0px; text-align: center;">
    31, Rajendra Singh Street,<br>
    Chunambupet, Gudiyatham.<br>
    Phone: 9600399287.
</h4>

    
    
      <h3>Bills for ${new Date(selectedDate).toLocaleDateString()}</h3>
      ${filteredBills.map((bill, index) => `
        <h4>Customer: ${bill.customerName}</h4>
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Total Amount</th>
              <th>Date and Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${index + 1}</td>
              <td>₹${bill.totalAmount.toFixed(2)}</td>
              <td>${formatDate(bill.createdAt)}</td>
            </tr>
          </tbody>
        </table>
      `).join('')}
      <h4>Total Amount: ₹${totalAmount}</h4>
      <div class="footer">
      Billed by CORPWINGS
    </div>
    </div>
    
  </body>
  </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};


  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
  };

  const filterBills = (date, term) => {
    const filtered = bills.filter(bill => {
      const formattedDate = new Date(bill.createdAt).toLocaleDateString();
      const includesDate = date ? formattedDate === new Date(date).toLocaleDateString() : true;
      const includesTerm = new Date(bill.createdAt).toLocaleString().toLowerCase().includes(term);
      return includesDate && includesTerm;
    });
    setFilteredBills(filtered);

    const total = filtered.reduce((total, bill) => total + bill.totalAmount, 0);
    setTotalAmount(total.toFixed(2));
  };

  const handleReverseOrder = () => {
    setFilteredBills([...filteredBills].reverse());
    setIsReversed(!isReversed);
  };

  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="d-flex">
      <Sidebar showSidebar={showSidebar} />
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: showSidebar ? '250px' : '0', transition: 'margin-left 0.3s ease' }}>
        {/* <Navbar toggleSidebar={toggleSidebar} /> */}
        <div className="flex-grow-1 billdetails">
          <Container className="mt-4 ">
            <h2 className='billTitle'>
              Billing Statements
            </h2>

            <Form.Group controlId="search" className="mb-4">
              {/* <Form.Control
                type="text"
                placeholder="Search by Date"
                value={searchTerm}
                onChange={handleSearch}
              /> */}
              <Form.Label>Filter by Date:</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </Form.Group>

            <Button onClick={handleReverseOrder} className='btn btn-primary'>
              {isReversed ? 'Show Oldest First' : 'Show Newest First'}
            </Button>

            <Table striped bordered hover responsive className="mt-4">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Customer Name</th>
                  <th>Contact Number</th>
                  <th>Total Amount</th>
                  <th>Date and Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill, index) => (
                  <tr key={bill._id}>
                    <td>{index + 1}</td>
                    <td>{bill.customerName}</td>
                    <td>{bill.contactNumber}</td>
                    <td>₹{bill.totalAmount.toFixed(2)}</td>
                    <td>{formatDate(bill.createdAt)}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePrint(bill)}
                      >
                        Print
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h4>Total Amount: ₹{totalAmount}</h4>
            <Button onClick={handlePrintFilteredBills} className='btn btn-primary'>
              Print Filtered Bills
            </Button>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default BillPage;
