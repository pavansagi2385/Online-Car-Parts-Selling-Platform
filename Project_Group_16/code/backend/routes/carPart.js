const express = require("express");
const connection = require("../database");
const router = express.Router();
router.get("/get", (req, res, next) => {
  var query = "select carPart.*,images.* from carPart join images on carPart.car_part_id=images.car_part_id join garageOwner g on g.owner_id=carPart.owner_id";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/get/:category", (req, res, next) => {
  const category = req.params.category;
  const query =
    `select distinct * from carPart c join images i on c.car_part_id = i.car_part_id 
    join category ct on ct.category_id = c.category_id 
     where c.category_id = ?`;
  connection.query(query, [category], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        const theater = results;

        res.status(200).json(theater);
      } else {
        res.status(404).json({ message: "theaters not found" });
      }
    } else {
      res.status(500).json(err);
    }
  });
});

// POST endpoint to create a new car part
router.post('/create', (req, res) => {
    const {
        name,
        description,
        price,
        quantity_in_stock,
        model,
        manufactured_date,
        manufactured_details,
        instructions_to_use,
        compactability,
        isActive,
        offers,
        category_id,
        owner_id,
        url, // Image URL field
    } = req.body;

    // Validate required fields
    if (
        !name || !description || !price || !quantity_in_stock || !model ||
        !manufactured_date || !category_id || !owner_id || !url
    ) {
        return res.status(400).json({ message: "All required fields must be filled" });
    }

    // SQL query to insert a new car part
    const carPartQuery = `
        INSERT INTO carPart (
            name, description, price, quantity_in_stock, model, 
            manufactured_date, manufactured_details, instructions_to_use, 
            compactability, isActive, offers, category_id, owner_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Begin a transaction to ensure atomicity for both carPart and image creation
    connection.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to start transaction", error: err });
        }

        // Insert the car part
        connection.query(
            carPartQuery,
            [
                name, description, price, quantity_in_stock, model,
                manufactured_date, manufactured_details, instructions_to_use,
                compactability, isActive, offers, category_id, owner_id
            ],
            (err, carPartResults) => {
                if (err) {
                    return connection.rollback(() => {
                        res.status(500).json({ message: "Failed to create car part", error: err });
                    });
                }

                // Get the ID of the newly inserted car part
                const carPartId = carPartResults.insertId;

                // SQL query to insert the image
                const imageQuery = `
                    INSERT INTO images (url, description, car_part_id)
                    VALUES (?, ?, ?)
                `;

                connection.query(
                    imageQuery,
                    [url, `Image for car part: ${name}`, carPartId],
                    (err, imageResults) => {
                        if (err) {
                            return connection.rollback(() => {
                                res.status(500).json({ message: "Failed to save image URL", error: err });
                            });
                        }

                        // Commit the transaction
                        connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    res.status(500).json({ message: "Failed to commit transaction", error: err });
                                });
                            }

                            res.status(201).json({
                                message: "Car part created successfully",
                                carPartId,
                                imageId: imageResults.insertId,
                            });
                        });
                    }
                );
            }
        );
    });
});


// Update a car part by ID
router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    quantity_in_stock,
    model,
    manufactured_date,
    manufactured_details,
    instructions_to_use,
    compactability,
    isActive,
    offers,
    category_id,
    owner_id,
    url,
  } = req.body;

  // Update carPart query
  const updateQuery = `
    UPDATE carPart 
    SET 
      name = ?, 
      description = ?, 
      price = ?, 
      quantity_in_stock = ?, 
      model = ?, 
      manufactured_date = ?, 
      manufactured_details = ?, 
      instructions_to_use = ?, 
      compactability = ?, 
      isActive = ?, 
      offers = ?, 
      category_id = ?, 
      owner_id = ?
    WHERE car_part_id = ?
  `;

  // Update linked image query (if image_url is provided)
  const updateImageQuery = `
    update images set url=? where car_part_id=?
  `;

  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: "Transaction error", error: err });
    }

    // Update carPart
    connection.query(
      updateQuery,
      [
        name,
        description,
        price,
        quantity_in_stock,
        model,
        manufactured_date,
        manufactured_details,
        instructions_to_use,
        compactability,
        isActive,
        offers,
        category_id,
        owner_id,
        id,
      ],
      (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ message: "Failed to update car part", error: err });
          });
        }

        // Update image if provided
        if (url) {
          connection.query(updateImageQuery, [url, id], (err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ message: "Failed to update image", error: err });
              });
            }
          });
        }

        // Commit transaction
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ message: "Transaction commit error", error: err });
            });
          }
          res.status(200).json({ message: "Car part updated successfully" });
        });
      }
    );
  });
});

// Delete a car part by ID
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  const deleteImagesQuery = "DELETE FROM images WHERE car_part_id = ?";
  const deletecarPartItemQuery="DELETE FROM carPartItem WHERE car_part_id = ?"
  const deleteCarPartQuery = "DELETE FROM carPart WHERE car_part_id = ?";
  const deleteReviewQuery = "DELETE FROM reviews WHERE car_part_id = ?";
  
  
  const deleteOrderDetailsQuery = `
  DELETE FROM orderDetails
  WHERE partItem_id IN (
      SELECT partItem_id FROM carPartItem WHERE car_part_id IN (
          SELECT car_part_id FROM carPart WHERE car_part_id = ?
      )
  )`;

  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: "Transaction error", error: err });
    }

    // Delete linked images
    connection.query(deleteImagesQuery, [id], (err, results) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ message: "Failed to delete linked images", error: err });
        });
      }
      connection.query(deleteOrderDetailsQuery, [id], (err, results) => {
        if (err) {
            return connection.rollback(() => {
                res.status(500).json({ message: "Failed to delete order details", error: err });
            });
        }
        connection.query(deleteReviewQuery, [id], (err, results) => {
          if (err) {
              return connection.rollback(() => {
                  res.status(500).json({ message: "Failed to delete review details", error: err });
              });
          }
      connection.query(deletecarPartItemQuery, [id], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ message: "Failed to delete linked carParItem", error: err });
          });
        }
        
      // Delete car part
      connection.query(deleteCarPartQuery, [id], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ message: "Failed to delete car part", error: err });
          });
        }

        if (results.affectedRows === 0) {
          return connection.rollback(() => {
            res.status(404).json({ message: "Car part not found" });
          });
        }

        // Commit transaction
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ message: "Transaction commit error", error: err });
            });
          }
          res.status(200).json({ message: "Car part deleted successfully" });
        });
      });
    });
  })
});
  });
  });
});






module.exports = router;