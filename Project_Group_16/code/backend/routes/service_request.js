const express = require("express");
const connection = require("../database");
const router = express.Router();

// GET all service requests
router.get('/get', (req, res) => {
  const queryString = 'SELECT * FROM service_request s join customer c on c.customer_id=s.customer_id';

  connection.query(queryString, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch service requests", error: err });
    }
    res.status(200).json(results); // Return the list of service requests
  });
});

// GET a specific service request by ID
router.get('/get/:customer_id', (req, res) => {
  const { customer_id } = req.params;
  const queryString = 'SELECT * FROM service_request WHERE customer_id = ?';

  connection.query(queryString, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch service request", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Service request not found" });
    }
    res.status(200).json(results); // Return the specific service request
  });
});

// POST endpoint to create a new service request
router.post('/create', (req, res) => {
    const { query, severity, customer_id } = req.body;
  
    // Validate input fields
    if (!query || !severity  || !customer_id) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    // SQL query to insert the service request into the database
    const queryString = `
      INSERT INTO service_request (query, severity, customer_id)
      VALUES (?, ?, ?)
    `;
    
    // Execute the SQL query
    connection.query(queryString, [query, severity, customer_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Failed to create service request", error: err });
      }
      res.status(201).json({
        message: "Service request created successfully",
        service_id: results.insertId,
      });
    });
  });

  // DELETE endpoint to delete a service request by ID
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
  
    // SQL query to delete the service request by its ID
    const queryString = 'DELETE FROM service_request WHERE service_id = ?';
  
    connection.query(queryString, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Failed to delete service request", error: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.status(200).json({ message: "Service request deleted successfully" });
    });
  });
  

  // PUT endpoint to edit a service request's description
router.put('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { description } = req.body; // Get the new description from request body

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  // SQL query to update the service request description
  const queryString = 'UPDATE service_request SET description = ? WHERE service_id = ?';

  connection.query(queryString, [description, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to update service request", error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Service request not found" });
    }

    res.status(200).json({ message: "Service request updated successfully" });
  });
});

module.exports = router;
