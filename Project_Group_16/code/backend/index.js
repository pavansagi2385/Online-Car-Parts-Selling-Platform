const express = require("express");
const connection = require("../backend/database");
const addressRouter = require("./routes/address");
// const adminRouter = require("./routes/admin");
const carPartRouter = require("./routes/carPart");
// const carPartItemRouter = require("./routes/carPartItem");
const categoryRouter = require("./routes/category");
const couponsRouter = require("./routes/coupons");
const customerRouter = require("./routes/customer");
// const imagesRouter = require("./routes/images");
// const orderDetailsRouter = require("./routes/orderDetails");
const orderRouter = require("./routes/orders");
const ownerRouter = require("./routes/owner");
// const paymentRouter = require("./routes/payment");
// const reviewRouter = require("./routes/reviews");
const serviceRouter = require("./routes/service_request");
// const shipmentRouter = require("./routes/shipment");
const cartRouter = require("./routes/shoppingcart");




const app = express();
var cors = require("cors");
app.use(cors());
require("dotenv").config();

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Rest API listening at port ${port}`);
});

app.use(express.json());
app.use("/address", addressRouter);
// app.use("/admin", adminRouter);
app.use("/car-part", carPartRouter);
// app.use("/part-item", carPartItemRouter);
app.use("/categ", categoryRouter);
app.use("/coupon", couponsRouter);
app.use("/cust", customerRouter);
// app.use("/image", imagesRouter);
// app.use("/orderDet", orderDetailsRouter);
app.use("/order", orderRouter);
app.use("/owner", ownerRouter);
// app.use("/payment", paymentRouter);
app.use("/service", serviceRouter);
// app.use("/ship", shipmentRouter);
app.use("/cart", cartRouter);
// app.use("/review", reviewRouter);

module.exports = app;