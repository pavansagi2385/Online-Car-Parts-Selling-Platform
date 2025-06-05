const express = require('express');
const connection = require('../database')
const router = express.Router();

router.get('/get', (req, res, next) => {
    var query = "select * from customer";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err)

        }
    })
})


router.post('/register', (req, res, next) => {
    let user = req.body;
    console.log(user)
    var datetime = new Date();
    var dateOnly = datetime.toISOString().split('T')[0];
    console.log(dateOnly)

    var query = `select * from customer where email=?`
    connection.query(query, [user.email, user.password], (err, results) => {
        if (!err && results.length > 0) {
            return res.status(200).json({ message: "Customer already has an account, Please login in it", customer_id: results[0].customer_id });
        }
        else if (results.length <= 0) {
            var query = "insert into customer(firstName,lastName,email, password,phoneNumber,dateCreated) values(?,?,?,?,?,?)"
            connection.query(query, [user.firstName, user.lastName, user.email, user.password, user.phoneNumber, dateOnly], (err, results) => {
                if (!err) {
                    console.log("register sucess")
                    return res.status(200).json({ message: "Customer registered successfully" });
                }
                else {
                    return res.status(500).json(err)

                }
            })
        }
    })
})

router.post('/login', (req, res, next) => {
    let user = req.body;
    var query = `select * from customer where email=? and password=?`
    connection.query(query, [user.email, user.password], (err, results) => {
        if (!err && results.length > 0) {
            return res.status(200).json({ message: "Customer is logged in successfully", customer_id: results[0].customer_id });
        }
        else if (results.length <= 0) {
            query = `select * from admin where email=? and password=?`
            connection.query(query, [user.email, user.password], (err, results) => {
                if (!err && results.length > 0) {
                    return res.status(200).json({ message: "Admin is logged in successfully", admin_id: results[0].admin_id })

                }
                else if (results.length <= 0) {
                    query = `select * from garageOwner where email=? and password=?`
                    connection.query(query, [user.email, user.password], (err, results) => {
                        if (!err && results.length > 0) {
                            return res.status(200).json({ message: "garageOwner is logged in successfully", owner_id: results[0].owner_id })

                        }
                        else {
                            {
                                return res.status(404).json({ message: "Enter proper Email and password" })
                            }
                        }
                    })
                }
            })

        }
        else {
            return res.status(500).json(err)

        }
    })
})
module.exports = router;