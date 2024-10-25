import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './MainContent.css'; // Ensure you define styles in this file
import { Button, Modal, Form } from 'react-bootstrap';
import logo from './logoUrl.png'; // Ensure this path matches the actual location of your logo

const MainContent = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  console.log(selectedOption)
  // Create refs for the search input and print button
  const searchInputRef = useRef(null);
  const printButtonRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/items')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));

    const handleKeyPress = (e) => {
      if (e.key === 'p') {
        // Trigger a click on the print button if it's available
        if (printButtonRef.current) {
          printButtonRef.current.click();
        }
      } else if (e.key === ' ') {
        // Focus the search input if the spacebar is pressed
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    products.indexOf(product) + 1 === parseInt(searchQuery)
  );

  const handleProductClick = (product) => {
    if (!selectedProducts.some(p => p._id === product._id)) {
      setSelectedProducts(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveClick = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p._id !== productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setSelectedProducts(prev => prev.map(p =>
      p._id === productId ? { ...p, quantity: Math.max(newQuantity, 1) } : p
    ));
  };

  const totalAmount = selectedProducts.reduce((sum, product) =>
    sum + (product.total * product.quantity), 0
  ).toFixed(2);

  const formatDateTime = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleCreateBill = () => {
    setShowModal(true); // Show the modal when creating the bill
  };

  const handleModalClose = () => setShowModal(false);

  const handleModalSubmit = () => {
    const createdAt = new Date(); // Current date and time

    // Convert to Abu Dhabi Time Zone
    const createdAtAbuDhabi = new Date(createdAt.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));

    const billData = {
      customerName,
      contactNumber,
      selectedOption,
      selectedProducts,
      totalAmount: parseFloat(totalAmount), // Convert totalAmount to a number
      createdAt: createdAtAbuDhabi.toISOString(), // Use ISO string for backend
      printDetails: generatePrintContent({
        customerName,
        contactNumber,
        selectedProducts,
        totalAmount: parseFloat(totalAmount), // Pass number format for printing
        createdAt: createdAtAbuDhabi // Pass the formatted date and time to print
      })
    };
    console.log(billData)
    axios.post('http://localhost:5000/bills', billData)
      .then(response => {
        console.log('Bill stored successfully:', response.data);
        handlePrint(billData);
        setSelectedProducts([]);
        setCustomerName("");
        setContactNumber("");
        setSelectedOption("");
      })
      .catch(error => {
        console.error('Error storing bill:', error.response ? error.response.data : error.message);
      });

    setShowModal(false); // Close the modal after submitting
  };

  const generatePrintContent = (billData) => {
    const dateTime = formatDateTime(new Date(billData.createdAt));

    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Print Bill</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      
    }
    .container {
      margin: 0 auto;
      width: 80%;
    }
    
    .header h3, .header h6, .header h1 {
      margin: 0;
      padding: 0;
    }
    .header h6 {
      font-size: 18px; /* Increase the font size of the address */
    }
    .header hr {
      border: none;
      border-top: 1px dotted #000;
      margin: 5px 0; /* Adjust this to reduce spacing around the hr */
    }
    .section {
      margin-top: 10px; /* Adjust this to control spacing above section */
      margin-bottom: 10px; /* Adjust this to control spacing below section */
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-Left:-40px;
    }
    th, td {
      padding: 8px 12px; /* Add padding to create space between columns */
      text-align: center; /* Center align text in table cells */
    }
    th {
      border-top: 1px dotted #000; /* Add a bottom border to cells */
    
      font-weight: bold;
      background-color: #f4f4f4;
      border-bottom: 1px dotted #000; /* Add a bottom border to cells */
    }
    .total-row td {
      border-top: 1px dotted #000; /* Add a top border to cells */
      font-weight: bold;
      border-bottom: 1px dotted #000; /* Add a bottom border to cells */
    }


  .footer {
  font-size: 11px;
  color: #000;
  font-weight: 600;
 
margin-left:-10px;
  }

    .total-row td:first-child {
      text-align: left; /* Align the "Total:" text to the left */
    }
    .total-row td:last-child {
      text-align: center; /* Center align the total amount */
    }
  </style>
</head>
<body>
        <div class="container">
            <div class="header">
                 <h1 style="font-size: 42px; font-weight: 800; margin-top:-20px; margin-left:-15px; padding: 0;">GREEN NATURALS</h1>
    <h4 style="font-weight: 900; margin-top: 8px; letter-spacing: 0px;">
    31, Rajendra Singh Street,<br>
    Chunambupet, Gudiyatham.<br>
    Phone: 9600399287.
</h4>
                <h1 style="margin-top:-10px; margin-bottom:10px; font-weight: 700;">Cash Bill</h1>
               </div>
            <div>
       <div>
    <table border="0" cellspacing="0" cellpadding="0" style="width: 300px; margin-left:-25px">
        <tr>
            <td style="text-align: left; width: 25%; padding: 0; margin-left: 10px;"><strong>Customer</strong></td>
            <td style="text-align: left; width: 5%; padding: 0;">:</td>
            <td style="text-align: left; width: 70%; padding: 0 0 0 5px;">${billData.customerName}</td>
        </tr>
        <tr>
            <td style="text-align: left; width: 25%; padding: 0; margin-left: 10px;"><strong>Contact</strong></td>
            <td style="text-align: left; width: 5%; padding: 0;">:</td>
            <td style="text-align: left; width: 70%; padding: 0 0 0 5px;">${billData.contactNumber}</td>
        </tr>
        <tr>
            <td style="text-align: left; width: 25%; padding: 0; margin-left: 10px;"><strong>Employee Code</strong></td>
            <td style="text-align: left; width: 5%; padding: 0;">:</td>
            <td style="text-align: left; width: 70%; padding: 0 0 0 5px;">E${billData.selectedOption}</td>
        </tr>
        <tr>
            <td style="text-align: left; width: 25%; padding: 0; margin-left: 10px;"><strong>Date & Time</strong></td>
            <td style="text-align: left; width: 5%; padding: 0;">:</td>
            <td style="text-align: left; width: 70%; padding: 0 0 0 5px;">${dateTime}</td>
        </tr>
    </table>
</div>  
                <table>
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Service</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${billData.selectedProducts.map((product, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${product.name}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>${(product.total * product.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="3" class="center-align">Total:</td>
                            <td>${billData.totalAmount.toFixed(2)}</td> <!-- Using toFixed safely -->
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="footer">
                <p>Billing CORPWINGS IT SERVICE 6380341944</p>
            </div>
            <div><p>** Visit Again !! ** </p></div>
        </div>
    </body>
    </html>

    `;
  };

  const handlePrint = (billData) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const printContent = generatePrintContent(billData);

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="main p-3">
      <div className="container">
        <div className="search-bar-container mb-3">
          <div className="input-group mt-5">
            <input
              type="text"
              className="form-control"
              placeholder="Search for products or enter number"
              value={searchQuery}
              onChange={handleSearchChange}
              ref={searchInputRef} // Bind the ref to the search input
            />
          </div>
        </div>

        <div className="product-list-container mb-3">
          <ul className="list-group">
            {filteredProducts.map((product, index) => (
              <li
                key={product._id}
                className="list-group-item d-flex justify-content-between align-items-center"
                onClick={() => handleProductClick(product)}
              >
                <span>{product.name}</span>
                <span className="badge badge-primary badge-pill">
                  ₹{product.total.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="selected-products-container mb-3">
          <h5>Selected Products:</h5>
          <ul className="list-group">
            {selectedProducts.map(product => (
              <li
                key={product._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{product.name}</span>
                <span>₹{(product.total * product.quantity).toFixed(2)}</span>
                <input
                  type="number"
                  value={product.quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                  style={{ width: '50px', marginLeft: '10px' }}
                />
                <button
                  className="btn btn-danger btn-sm ml-2"
                  onClick={() => handleRemoveClick(product._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="total-container mt-3">
            <h5>Total Amount: ₹{totalAmount}</h5>
            <Button
              variant="success"
              onClick={handleCreateBill}
              ref={printButtonRef} // Bind the ref to the print button
            >
              Create Bill
            </Button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCustomerName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </Form.Group>


            <Form.Group controlId="formContactNumber">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text" // Change to text for proper validation
                value={contactNumber}
                onChange={(e) => {
                  const input = e.target.value;
                  if (input.length <= 10 && /^\d*$/.test(input)) {
                    // Update only if input is digits and up to 10 digits
                    setContactNumber(input);
                  }
                }}
                required // Field is mandatory
                maxLength="10" // Limits input to 10 characters
                title="Contact number must be exactly 10 digits"
                placeholder="Enter 10-digit contact number"
              />
            </Form.Group>



            <Form.Group controlId="formSelectOption">
              <Form.Label>Select an Employee Code (E1-E10):</Form.Label>
              <Form.Control
                as="select"
                value={selectedOption}
                onChange={(e) => setSelectedOption(Number(e.target.value))}
              >
                <option value="" disabled>Select an option</option>
                {[...Array(10).keys()].map(num => (
                  <option key={num + 1} value={num + 1}>E{num + 1}</option>
                ))}
              </Form.Control>
            </Form.Group>


          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MainContent;