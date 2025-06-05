const express=require('express');
const connection=require('../database')
const router= express.Router();
router.get('/get',(req,res,next)=>{
    var query="select * from garageOwner";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err)

        }
    })
})


router.delete('/delete/:owner_id', (req, res, next) => {
    const ownerId = req.params.owner_id;

    // Begin a transaction to ensure atomicity
    connection.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: "Transaction start failed", error: err });
        }

        // Step 1: Delete orderDetails linked to carPartItems of the owner
        const deleteOrderDetailsQuery = `
            DELETE FROM orderDetails
            WHERE partItem_id IN (
                SELECT partItem_id FROM carPartItem WHERE car_part_id IN (
                    SELECT car_part_id FROM carPart WHERE owner_id = ?
                )
            )`;
        connection.query(deleteOrderDetailsQuery, [ownerId], (err, results) => {
            if (err) {
                return connection.rollback(() => {
                    res.status(500).json({ message: "Failed to delete order details", error: err });
                });
            }

            // Step 2: Delete reviews linked to car parts of the owner
            const deleteReviewsQuery = `
                DELETE FROM reviews
                WHERE car_part_id IN (
                    SELECT car_part_id FROM carPart WHERE owner_id = ?
                )`;
            connection.query(deleteReviewsQuery, [ownerId], (err, results) => {
                if (err) {
                    return connection.rollback(() => {
                        res.status(500).json({ message: "Failed to delete reviews", error: err });
                    });
                }

                // Step 3: Delete carPartItem entries linked to car parts of the owner
                const deleteCarPartItemsQuery = `
                    DELETE FROM carPartItem 
                    WHERE car_part_id IN (
                        SELECT car_part_id FROM carPart WHERE owner_id = ?
                    )`;
                connection.query(deleteCarPartItemsQuery, [ownerId], (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            res.status(500).json({ message: "Failed to delete car part items", error: err });
                        });
                    }

                    // Step 4: Delete images related to car parts of the owner
                    const deleteImagesQuery = `
                        DELETE FROM images 
                        WHERE car_part_id IN (
                            SELECT car_part_id FROM carPart WHERE owner_id = ?
                        )`;
                    connection.query(deleteImagesQuery, [ownerId], (err, results) => {
                        if (err) {
                            return connection.rollback(() => {
                                res.status(500).json({ message: "Failed to delete images", error: err });
                            });
                        }

                        // Step 5: Delete owner_category entries
                        const deleteOwnerCategoryQuery = `
                            DELETE FROM owner_category 
                            WHERE owner_id = ?`;
                        connection.query(deleteOwnerCategoryQuery, [ownerId], (err, results) => {
                            if (err) {
                                return connection.rollback(() => {
                                    res.status(500).json({ message: "Failed to delete owner-category links", error: err });
                                });
                            }

                            // Step 6: Delete related car parts
                            const deleteCarPartsQuery = "DELETE FROM carPart WHERE owner_id = ?";
                            connection.query(deleteCarPartsQuery, [ownerId], (err, results) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        res.status(500).json({ message: "Failed to delete car parts", error: err });
                                    });
                                }

                                // Step 7: Delete categories associated with the owner
                                const deleteCategoriesQuery = `
                                    DELETE FROM category 
                                    WHERE category_id IN (
                                        SELECT category_id FROM owner_category WHERE owner_id = ?
                                    )`;
                                connection.query(deleteCategoriesQuery, [ownerId], (err, results) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            res.status(500).json({ message: "Failed to delete categories", error: err });
                                        });
                                    }

                                    // Step 8: Delete the garage owner
                                    const deleteOwnerQuery = "DELETE FROM garageOwner WHERE owner_id = ?";
                                    connection.query(deleteOwnerQuery, [ownerId], (err, results) => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                res.status(500).json({ message: "Failed to delete garage owner", error: err });
                                            });
                                        }

                                        // Check if the owner existed
                                        if (results.affectedRows === 0) {
                                            return connection.rollback(() => {
                                                res.status(404).json({ message: "Garage owner not found" });
                                            });
                                        }

                                        // Commit the transaction
                                        connection.commit((err) => {
                                            if (err) {
                                                return connection.rollback(() => {
                                                    res.status(500).json({ message: "Transaction commit failed", error: err });
                                                });
                                            }
                                            res.status(200).json({ message: "Garage owner, related car parts, order details, reviews, images, categories, and items deleted successfully" });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});




module.exports=router;