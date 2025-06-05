const express = require("express");
const connection = require("../database");
const router = express.Router();

router.get("/get/:customer_id", (req, res, next) => {
    const customer_id = req.params.customer_id
    var query = `select * from address a join cust_address c on c.address_id=a.address_id where c.customer_id=${customer_id}`;

    connection.query(query, (err, results) => {
        if (!err) {
            console.log(results)
                    return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.put("/edit/:address_id", (req, res, next) => {
    const address_id = req.params.address_id;
    const { AptNumber, city, state, zipcode } = req.body; // Get the new data from the request body

    const query = `UPDATE address 
                   SET AptNumber = ?, city = ?, state = ?, zipcode = ? 
                   WHERE address_id = ?`;

    connection.query(query, [AptNumber, city, state, zipcode, address_id], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Address updated successfully" });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.delete("/delete/:address_id", (req, res, next) => {
    const address_id = req.params.address_id;

    // First delete the association in the cust_address table
    const deleteAssociationQuery = `DELETE FROM cust_address WHERE address_id = ?`;

    connection.query(deleteAssociationQuery, [address_id], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        // Then delete the address from the address table
        const deleteAddressQuery = `DELETE FROM address WHERE address_id = ?`;

        connection.query(deleteAddressQuery, [address_id], (err2, results2) => {
            if (err2) {
                return res.status(500).json(err2);
            }
            return res.status(200).json({ message: "Address deleted successfully" });
        });
    });
});


router.post("/add", (req, res, next) => {
    const { customer_id, AptNumber, city, state, zipcode } = req.body; // Get data from the request body

    // Insert new address into the address table
    const insertAddressQuery = `INSERT INTO address (AptNumber, city, state, zipcode) 
                                VALUES (?, ?, ?, ?)`;

    connection.query(insertAddressQuery, [AptNumber, city, state, zipcode], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        // After inserting the address, get the last inserted address_id
        const newAddressId = result.insertId;

        // Insert into cust_address to associate the new address with the customer
        const insertCustomerAddressQuery = `INSERT INTO cust_address (customer_id, address_id) 
                                            VALUES (?, ?)`;

        connection.query(insertCustomerAddressQuery, [customer_id, newAddressId], (err2, result2) => {
            if (err2) {
                return res.status(500).json(err2);
            }

            return res.status(200).json({ message: "Address added successfully" });
        });
    });
});




module.exports = router;
