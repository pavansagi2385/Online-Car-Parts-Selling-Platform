-- Create Tables with Auto-Incremented Primary Keys

CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(100),
    phoneNumber VARCHAR(15),
    dateCreated DATE
);

CREATE TABLE address (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    AptNumber VARCHAR(10),
    city VARCHAR(50),
    state VARCHAR(50),
    zipcode VARCHAR(10)
);

CREATE TABLE cust_address (
    cust_add_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    address_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (address_id) REFERENCES address(address_id)
);

CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    adminName VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(100)
);

CREATE TABLE service_request (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    query VARCHAR(255),
    severity VARCHAR(20),
    description TEXT,
    admin_id INT,
    customer_id INT,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE coupons (
    coupon_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    couponDiscount DECIMAL(5, 2),
    description TEXT,
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

CREATE TABLE cust_coupon (
    cust_coup_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    coupon_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (coupon_id) REFERENCES coupons(coupon_id)
);

CREATE TABLE garageOwner (
    owner_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(100),
    phoneNumber VARCHAR(15),
    servicesOffered TEXT,
    availability VARCHAR(50),
    isActive BOOLEAN,
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

CREATE TABLE category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    categName VARCHAR(50),
    description TEXT
);

CREATE TABLE owner_category (
    own_cate_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    category_id INT,
    FOREIGN KEY (owner_id) REFERENCES garageOwner(owner_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TABLE carPart (
    car_part_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    description TEXT,
    price DECIMAL(10, 2),
    quantity_in_stock INT,
    model VARCHAR(50),
    manufactured_date DATE,
    manufactured_details TEXT,
    instructions_to_use TEXT,
    compactability VARCHAR(50),
    isActive BOOLEAN,
    offers TEXT,
    category_id INT,
    owner_id INT,
    FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (owner_id) REFERENCES garageOwner(owner_id)
);

CREATE TABLE images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    url TEXT,
    description TEXT,
    car_part_id INT,
    FOREIGN KEY (car_part_id) REFERENCES carPart(car_part_id)
);

CREATE TABLE shoppingcart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    createdDate DATE,
    description TEXT,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE carPartItem (
    partItem_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(50),
    quantity INT,
    partItemsCost DECIMAL(10, 2),
    conditionOfItem VARCHAR(50),
    car_part_id INT,
    cart_id INT,
    FOREIGN KEY (car_part_id) REFERENCES carPart(car_part_id),
    FOREIGN KEY (cart_id) REFERENCES shoppingcart(cart_id)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    total_cost DECIMAL(10, 2),
    orderStatus VARCHAR(50),
    orderDate DATE,
    comments TEXT,
    isCovered BOOLEAN,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE orderDetails (
    orderDetails_id INT AUTO_INCREMENT PRIMARY KEY,
    orderItemName VARCHAR(50),
    count INT,
    price DECIMAL(10, 2),
    description TEXT,
    sizeOfEachorder VARCHAR(50),
    order_id INT,
    partItem_id INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (partItem_id) REFERENCES carPartItem(partItem_id)
);

CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_number VARCHAR(50),
    TaxAmount DECIMAL(10, 2),
    shipmentCost DECIMAL(10, 2),
    TotalAmountPaid DECIMAL(10, 2),
    paymentStatus VARCHAR(50),
    paymentDate DATE,
    paymentMethod VARCHAR(50),
    order_id INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE shipment (
    shipment_id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_mode VARCHAR(50),
    shipment_status VARCHAR(50),
    trackingNumber VARCHAR(50),
    weight DECIMAL(10, 2),
    size VARCHAR(50),
    count INT,
    order_id INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    comments TEXT,
    rating INT,
    customer_id INT,
    car_part_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (car_part_id) REFERENCES carPart(car_part_id)
);
