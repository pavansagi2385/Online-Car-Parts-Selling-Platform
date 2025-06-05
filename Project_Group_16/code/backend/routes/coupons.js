const express = require("express");
const connection = require("../database");
const router = express.Router();

router.get("/get/:customer_id", (req, res, next) => {
    const customer_id = req.params.customer_id
    var query = `select * from coupons c join cust_coupon cc on c.coupon_id=cc.coupon_id where cc.customer_id=${customer_id}`;

    connection.query(query, (err, results) => {
        if (!err) {
            console.log(results)
                    return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});



router.post("/post/:customer_id", (req, res, next) => {
    const customer_id = req.params.customer_id
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




module.exports = router;
