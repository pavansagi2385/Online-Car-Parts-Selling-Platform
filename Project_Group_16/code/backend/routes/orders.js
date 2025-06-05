const express = require("express");
const connection = require("../database");
const router = express.Router();

router.get("/get/:order_id", (req, res, next) => {
    const order_id = req.params.order_id
    var query = `select * from orders where order_id=${order_id}`;

    connection.query(query, (err, results) => {
        if (!err) {
            console.log(results)
                    return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get("/cust/:customer_id", (req, res, next) => {
    const customer_id = req.params.customer_id
    var query = `select * from orders where customer_id=${customer_id}`;

    connection.query(query, (err, results) => {
        if (!err) {
            console.log(results)
                    return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post("/place", (req, res, next) => {
    const order = req.body.orderPayload;
    console.log(order)
    var query="insert into orders(total_cost,orderStatus,orderDate, comments,isCovered, customer_id) values(?,?,?,?,?,?)"
    connection.query(query,[order.total_cost,order.orderStatus,order.orderDate,order.comments,order.isCovered,order.customer_id],(err,results)=>{
        if(!err){
            return res.status(200).json(results.insertId);
        }
        else{
            return res.status(500).json(err)

        }
    })
   
});

router.delete("/delete/:customer_id", (req, res) => {

    const customer_id = req.params.customer_id
    var query = `select cart_id from shoppingcart where customer_id=${customer_id}`;
    connection.query(query, (err, results) => {
        if (!err) {
            const cart_id = results[0].cart_id;
            const deleteQuery = "DELETE FROM carPartItem WHERE cart_id = ?";
            connection.query(deleteQuery, [cart_id], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error(err);
                        res.status(500).send("Error deleting cart");
                    });
                }
                const deletecartQuery = "DELETE FROM shoppingcart WHERE customer_id = ?";
                connection.query(deletecartQuery, [customer_id], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error(err);
                            res.status(500).send("Error deleting cart");
                        });
                    }
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error(err);
                                res.status(500).send("Error committing transaction");
                            });
                        }
                        res.send("shopping cart deleted sucessfully");
                    });
                })
            });

        }
    })
});


module.exports = router;
