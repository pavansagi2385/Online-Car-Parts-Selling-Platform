const express = require("express");
const connection = require("../database");
const router = express.Router();

router.get("/get/:customer_id", (req, res, next) => {
    const customer_id = req.params.customer_id
    var query = `select cart_id from shoppingcart where customer_id=${customer_id}`;
    connection.query(query, (err, results) => {
        if (!err) {
            const cart_id = results[0].cart_id;
            var query = `select * from carPartItem ci join carPart c on c.car_part_id=ci.car_part_id where cart_id=${cart_id}`;
            connection.query(query, (err, results) => {
                if (!err) {
                    return res.status(200).json(results);

                } else {
                    return res.status(500).json(err);
                }
            });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post("/create", (req, res, next) => {
    const carts = req.body.cart;
    const customer_id = req.body.customer_id;
    if (!Array.isArray(carts) || carts.length === 0) {
        return res.status(400).json({ error: "Cart items are required" });
    }

    // Generate description from the first cart item
    const description = `${carts[0].categName} is bought in this cart`;

    // Insert into shoppingcart table
    const queryShoppingCart = `INSERT INTO shoppingcart(description,customer_id) VALUES (?,?)`;
    const shoppingCartValues = [description, customer_id];

    connection.query(queryShoppingCart, shoppingCartValues, (err, results) => {
        if (err) {
            console.error("Error inserting into shoppingcart:", err);
            return res.status(500).json({ error: "Failed to create shopping cart" });
        }

        const insertedCartId = results.insertId; 

        const queryCarPartItem = `
            INSERT INTO carPartItem (item_name, quantity, partItemsCost, car_part_id, cart_id) 
            VALUES ?
        `;
        const carPartItemsValues = carts.map(cart => [
            cart.categName,
            cart.quantity,
            cart.price,
            cart.car_part_id,
            insertedCartId
        ]);

        connection.query(queryCarPartItem, [carPartItemsValues], (err, results) => {
            if (err) {
                console.error("Error inserting into carPartItem:", err);
                return res.status(500).json({ error: "Failed to add cart items" });
            }

            return res.status(200).json({
                message: "Cart created successfully",
                cartId: insertedCartId,
                affectedRows: results.affectedRows
            });
        });
    });
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
