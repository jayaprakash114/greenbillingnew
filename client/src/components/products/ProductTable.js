import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductTable.css';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    gstPercentage: ''
  });
  const [editProduct, setEditProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/items')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const calculateGST = (price, gstPercentage) => {
    return (price * gstPercentage) / 100;
  };

  const handleAddSubmit = async () => {
    const price = parseFloat(newProduct.price);
    const gstPercentage = parseFloat(newProduct.gstPercentage);

    if (isNaN(price) || price < 0 || isNaN(gstPercentage) || gstPercentage < 0) {
      alert('Please enter valid price and GST percentage values.');
      return;
    }

    const gstAmount = calculateGST(price, gstPercentage);
    const total = price + gstAmount;

    try {
      const response = await axios.post('http://localhost:5000/items', {
        name: newProduct.name,
        price: price,
        gstPercentage: gstPercentage,
        gst: gstAmount,
        total: total
      });
      setProducts(prev => [...prev, response.data]);
      setShowAddModal(false);
      setNewProduct({
        name: '',
        price: '',
        gstPercentage: ''
      });
    } catch (error) {
      console.error('Error adding product:', error.response ? error.response.data : error.message);
    }
  };

  const handleEditSubmit = async () => {
    const price = parseFloat(editProduct.price);
    const gstPercentage = parseFloat(editProduct.gstPercentage);

    if (isNaN(price) || price < 0 || isNaN(gstPercentage) || gstPercentage < 0) {
      alert('Please enter valid price and GST percentage values.');
      return;
    }

    const gstAmount = calculateGST(price, gstPercentage);
    const total = price + gstAmount;

    try {
      const response = await axios.put(`http://localhost:5000/items/${editProduct._id}`, {
        name: editProduct.name,
        price: price,
        gstPercentage: gstPercentage,
        gst: gstAmount,
        total: total
      });
      setProducts(prev => prev.map(p => p._id === response.data._id ? response.data : p));
      setShowEditModal(false);
      setEditProduct(null);
    } catch (error) {
      console.error('Error updating product:', error.response ? error.response.data : error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      setProducts(prev => prev.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error.response ? error.response.data : error.message);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    products.indexOf(product) + 1 === parseInt(searchQuery)
  );

  return (
    <div className="container mt-5 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="productDetailsh2">Product Details</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>Add Item</button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control " style={{marginTop:"53px"}}
          placeholder="Search Products by S.No or Name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>GST Amount</th>
            <th>Total</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <tr key={product._id}>
                <td>{products.indexOf(product) + 1}</td>
                <td>{product.name}</td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>₹{product.gst.toFixed(2)}</td>
                <td>₹{product.total.toFixed(2)}</td>
                <td>
                  <button 
                    className="btn btn-info btn-sm"
                    onClick={() => setSelectedProduct(product)}
                  >
                    View Details
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditProduct(product);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No products found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for adding new product */}
      <div className={`modal fade ${showAddModal ? 'show' : ''}`} style={{ display: showAddModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addProductModalLabel">Add New Product</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="productName">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productPrice">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    id="productPrice"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gstPercentage">GST Percentage</label>
                  <input
                    type="number"
                    className="form-control"
                    id="gstPercentage"
                    name="gstPercentage"
                    value={newProduct.gstPercentage}
                    onChange={handleInputChange}
                    placeholder="Enter GST percentage"
                    min="0"
                    step="0.01"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleAddSubmit}>Save changes</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for editing product */}
      {editProduct && (
        <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="editProductModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editProductModalLabel">Edit Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="editProductName">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editProductName"
                      name="name"
                      value={editProduct.name}
                      onChange={handleEditInputChange}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editProductPrice">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      id="editProductPrice"
                      name="price"
                      value={editProduct.price}
                      onChange={handleEditInputChange}
                      placeholder="Enter price"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editGstPercentage">GST Percentage</label>
                    <input
                      type="number"
                      className="form-control"
                      id="editGstPercentage"
                      name="gstPercentage"
                      value={editProduct.gstPercentage}
                      onChange={handleEditInputChange}
                      placeholder="Enter GST percentage"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleEditSubmit}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product details modal */}
      {selectedProduct && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="productDetailsLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="productDetailsLabel">Product Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedProduct(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <h5>{selectedProduct.name}</h5>
                <p>Price: ${selectedProduct.price.toFixed(2)}</p>
                <p>GST Amount: ${selectedProduct.gst.toFixed(2)}</p>
                <p>Total: ${selectedProduct.total.toFixed(2)}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
