const express=require('express');

const {open}=require('sqlite');
const sqlite3=require('sqlite3');

const path=require('path');
const { request } = require('http');
const { error } = require('console');
const app=express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

let db;
const dbPath=path.join(__dirname,'Customer.db');
const dbConnectionServer=async ()=>{
  try{
    db= await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
     await db.run("PRAGMA foreign_keys = ON;");
    app.listen(3000,()=>{
      console.log("Server started at localhost https://localhost:3000/")
    })
  }catch(err){
    console.log(`Error Msg: ${err.message}`)
    process.exit(-1);
  }
}

dbConnectionServer();

// Creating a new customer with specific customer and there address details
app.post('/customer',async(request,response)=>{
  const {firstName,lastName,email,phone,addresses}=request.body;
  
  if(!firstName || !lastName || !email || !phone){
    return response.status(400).json({error: "First name, last name and phone and email are required"});
  }
  try{
   await db.exec("BEGIN");

  const emailExisitCheck=`SELECT * FROM Customer where email= ? ;`;
  const emailExistResult=await db.get(emailExisitCheck,[email]);

  if(emailExistResult){
    await db.run("ROLLBACK");
    return response.status(400).json({error:'Email already exists'});
  }

  const insertCustomerQuery=`
  INSERT INTO customer (firstName,lastName,email,phone) values (?, ?, ?, ?);
  `;
  const result=await db.run(insertCustomerQuery,[firstName,lastName,email,phone]);
  const customerId=result.lastID;

  if (addresses && addresses.length > 0) {
      for (let i=0;i<addresses.length; i++) {
        const {street,city,state,postalCode,country}=addresses[i];
        if(!street || !city || !state || !postalCode || !country){
          return response.status(400).json({
            error: `Address ${i+1} is missing required fields`
          });
        }
        await db.run(
          `INSERT INTO Address (customerId, street, city, state, postalCode,country) VALUES (?, ?, ?, ?, ?, ?)`,
          [customerId, street, city, state, postalCode,country]
        );
      }
  }
  await db.exec("COMMIT");
  return response.json({message: "Customer created Successfully",id:customerId});
  }catch(err){
    await db.run("ROLLBACK");
    return response.status(500).json({error: err.message});
  }
});

// Creating a new address for specific customer with there customerId

app.post('/customer/:id',async(request,response)=>{
  const {id}=request.params;
  const {street,city,state,postalCode,country}=request.body;
  if(!street || !city || !state || !postalCode || !country){
    return response.status(400).send("Every Filed is required");
  } 
  try{
    const customer = await db.get(`SELECT * FROM Customer WHERE customerId = ?`, [id]);
    if (!customer) {
      return response.status(404).json({ error: "Customer not found" });
    }
    const insertAddresstoCustomerQuery=`
      INSERT INTO Address (customerId,street,city,state,postalCode,country) Values (?, ?, ?, ?, ?, ?)
    `;

    const newAddress=await db.run(insertAddresstoCustomerQuery,[id,street,city,state,postalCode,country]);
    return response.status(201).json({
      message: "Address added successfully",
      addressId: newAddress.lastID,
      customerId: id,
    });
  }catch(err){
    return response.status(400).json({error: err.message});
  }
})


// Get all Customer and there address details 
app.get('/customer', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.customerId, c.firstName,c.lastName, c.email, c.phone, 
        a.addressId, a.street, a.city, a.state, a.postalCode, a.country
      FROM Customer c
      LEFT JOIN Address a ON c.customerId = a.customerId;
    `;
    
    const rows = await db.all(query);

    if (rows.length === 0) {
      return res.status(200).json({ message: "No customers found", customers: [] });
    }

    // Transform flat rows into nested structure
    const customers = {};
    rows.forEach(row => {
      if (!customers[row.customerId]) {
        customers[row.customerId] = {
          customerId: row.customerId,
          name: row.name,
          email: row.email,
          phone: row.phone,
          addresses: []
        };
      }
      if (row.addressId) {  // only push if address exists
        customers[row.customerId].addresses.push({
          addressId: row.addressId,
          street: row.street,
          city: row.city,
          state: row.state,
          postalCode: row.postalCode,
          country: row.country
        });
      }
    });

    res.status(200).json(Object.values(customers));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Specific Customer and there address details
app.get('/customer/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const getSpecificCustomerQuery = `
      SELECT Customer.customerId, Customer.firstName, Customer.lastName, Customer.email, Customer.phone,
             Address.addressId, Address.street, Address.city, Address.state, Address.postalCode, Address.country
      FROM Customer
      LEFT JOIN Address ON Customer.customerId = Address.customerId
      WHERE Customer.customerId = ?;
    `;

    const customerDetails = await db.all(getSpecificCustomerQuery, [id]);

    if (customerDetails.length === 0) {
      return response.status(404).json({ error: "Customer not found" });
    }

    // Group addresses under the customer (in case of multiple addresses)
    const customer = {
      customerId: customerDetails[0].customerId,
      name: customerDetails[0].name,
      email: customerDetails[0].email,
      phone: customerDetails[0].phone,
      addresses: customerDetails
        .filter(row => row.addressId !== null) // In case customer has no address
        .map(row => ({
          addressId: row.addressId,
          street: row.street,
          city: row.city,
          state: row.state,
          postalCode: row.postalCode,
          country: row.country,
        })),
    };

    return response.status(200).json(customer);

  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
});



// Updating the Customer details with lastName,firstName,phone,email (Not by address)
app.put('/customer/:id', async (request, response) => {
  const { id } = request.params;
  const { firstName, lastName, phone, email } = request.body;

  if (!firstName || !lastName || !phone || !email) {
    return response.status(400).send("Every field is required");
  }

  try {
    const customer = await db.get(
      `SELECT * FROM Customer WHERE customerId = ?`,
      [id]
    );

    if (!customer) {
      return response.status(404).json({ error: "Customer not found" });
    }

    const updateSpecificCustomerQuery = `
      UPDATE Customer 
      SET firstName = ?, lastName = ?, phone = ?, email = ?
      WHERE customerId = ?;
    `;

    const result = await db.run(updateSpecificCustomerQuery, [
      firstName,
      lastName,
      phone,
      email,
      id
    ]);

    if (result.changes == 0) {
      return response.status(400).json({ error: "Update failed" });
    }

    return response.status(200).json({
      message: "Customer updated successfully",
      updatedCustomer: {
        customerId: id,
        firstName,
        lastName,
        phone,
        email
      }
    });

  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
});

// Updating the address details of specific address 
app.put('/address/:addressId', async (request, response) => {
  const { addressId } = request.params;
  const { street, city, state, postalCode, country } = request.body;

  if (!street || !city || !state || !postalCode || !country) {
    return response.status(400).send("Every field is required");
  }

  try {
    // Verify that address exists
    const address = await db.get(
      `SELECT * FROM Address WHERE addressId = ?`,
      [addressId]
    );
    if (!address) {
      return response.status(404).json({ error: "Address not found" });
    }

    // Update the address
    const updateAddressQuery = `
      UPDATE Address 
      SET street = ?, city = ?, state = ?, postalCode = ?, country = ?
      WHERE addressId = ?;
    `;

    await db.run(updateAddressQuery, [
      street,
      city,
      state,
      postalCode,
      country,
      addressId,
    ]);

    return response.status(200).json({
      message: "Address updated successfully",
      addressId,
      customerId: address.customerId, // we can return customerId from the fetched row
    });

  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
});

//Delete Specific Address by AddressId
app.delete('/address/:addressId', async (request, response) => {
  const { addressId } = request.params;

  try {
    // Check if address exists
    const checkAddressQuery = `SELECT * FROM Address WHERE addressId = ?;`;
    const addressExist = await db.get(checkAddressQuery, [addressId]);

    if (!addressExist) {
      return response.status(404).send("Address Not Found");
    }

    // Delete the address
    const deleteQuery = `DELETE FROM Address WHERE addressId = ?;`;
    await db.run(deleteQuery, [addressId]);

    return response.status(200).send("Deleted Successfully");
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

//Delete Specific Customer and there address details
app.delete('/customer/:customerId',async(request,response)=>{
  const {customerId}=request.params;
  try{
  const customerExistQuery=`SELECT * FROM Customer where customerId=${customerId};`;
  const customerExist=await db.get(customerExistQuery);
  if(!customerExist){
    return response.status(400).send("Cusomer Not Exist");
  }
  await db.run(`DELETE FROM Customer where Customer.customerId=${customerId};`);
  return response.status(200).send("Customer and their addresses deleted successfully");
  }catch(err){
    return response.status(500).json({ error: error.message });
  }
});

//Get All products 

app.get('/products',async(request,response)=>{
    try {
    const orders = await db.all(`SELECT * FROM Product`);
    response.status(200).json(orders);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
})

//Create New Order
// Create a new order for a specific customer
app.post('/customerorder/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    // Check if customer exists
    const customer = await db.get(
      `SELECT firstName, lastName FROM Customer WHERE customerId = ?;`,
      [customerId]
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Create new order
    const result = await db.run(
      `INSERT INTO Orders (customerId) VALUES (?);`,
      [customerId]
    );

    const newOrderId = result.lastID;
    const CustomerName = `${customer.firstName} ${customer.lastName}`;

    return res.status(201).json({
      message: "New Order Created Successfully",
      newOrderId,
      CustomerName
    });

  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({ error: err.message });
  }
});




//Creating new Order Item Details
app.post('/order/:orderId/product/:productId',async(request,response)=>{
  const {orderId,productId}=request.params;
  const {quantity}=request.body;
  console.log(quantity);
  if (!quantity || quantity <= 0) {
    return response.status(400).send("Quantity is required and must be greater than 0");
  }
  try{
  const orderIdExist=await db.get(`SELECT * FROM Orders WHERE orderId=?;`,[orderId]);
  const productExist=await db.get(`SELECT * FROM Product WHERE productId=?`,[productId]);
  if(!orderIdExist){
    return response.status(400).send("Order Doesnot exist");
  }
  if(!productExist){
    return response.status(400).send("Product Doesnot Exits");
  }
  const cuurentTotalAmount=await db.get(`SELECT totalAmount from Orders WHERE orderId=?`,[orderId]);
  const currentproductprice= await db.get(`SELECT price FROM Product WHERE productId=?;`,[productId]);
  const {price}=currentproductprice;
  const {totalAmount}=cuurentTotalAmount;
  let newTotal=totalAmount+(price*quantity);
  console.log(`New Total: ${newTotal}`);
  console.log(newTotal);
  const addNewOrderDetails=await db.run(
          `INSERT INTO OrderItems (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`,
          [orderId, productId, quantity, price]
        );
  const totalAmountUpdateQuery=`UPDATE Orders SET totalAmount=? WHERE Orders.orderId=?;`
  const totalAmountOrderUpdate=await db.run(totalAmountUpdateQuery,[newTotal,orderId])
  response.status(200).json({
    message:"Order item Added Successfully to the Order"
  });
}catch(err){
  return response.status(400).json({error:err.message})
}
});

//Get All Orders
// Get all orders with order items

// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await db.all(`SELECT * FROM Orders`);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all orders with their order items
app.get('/orders/all', async (req, res) => {
  try {
    // Fetch all orders
    const orders = await db.all(`SELECT * FROM Orders`);

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        // Fetch customer name
        const customer = await db.get(`SELECT firstName, lastName FROM Customer WHERE customerId = ?`, [order.customerId]);
        const CustomerName = customer ? `${customer.firstName} ${customer.lastName}` : "Unknown Customer";

        // Fetch order items
        const items = await db.all(
          `SELECT oi.orderItemId, oi.productId, p.productName as productName, oi.quantity, oi.price
           FROM OrderItems oi
           JOIN Product p ON oi.productId = p.productId
           WHERE oi.orderId = ?`,
          [order.orderId]
        );

        return { ...order, CustomerName, orderItems: items };
      })
    );

    res.status(200).json(ordersWithItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get a specific order item from a specific order
app.get('/orders/:orderId/items/:orderItemId', async (req, res) => {
  const { orderId, orderItemId } = req.params;

  try {
    const item = await db.get(
      `SELECT oi.orderItemId, oi.productId, p.productName as productName, oi.quantity, oi.price
       FROM OrderItems oi
       JOIN Product p ON oi.productId = p.productId
       WHERE oi.orderId = ? AND oi.orderItemId = ?`,
      [orderId, orderItemId]
    );

    if (!item) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete Orders
app.delete('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    // Check if order exists
    const order = await db.get(`SELECT * FROM Orders WHERE orderId = ?`, [orderId]);
    if (!order) return res.status(404).send("Order not found");
    // Delete the order (OrderItems will be deleted automatically)
    await db.run(`DELETE FROM Orders WHERE orderId = ?`, [orderId]);
    res.status(200).send({ message: "Order and all its items deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete specific OrderItem for this specific order
// DELETE an order item and update totalAmount
// DELETE an order item and update totalAmount
app.delete('/orders/:orderId/items/:orderItemId', async (req, res) => {
  const { orderId, orderItemId } = req.params;

  try {
    // Fetch the item details
    const item = await db.get(
      `SELECT quantity, price 
       FROM OrderItems 
       WHERE orderItemId = ? AND orderId = ?`,
      [orderItemId, orderId]
    );

    if (!item) {
      return res.status(404).send("Order item not found for this order");
    }

    // Calculate subtotal (quantity * price)
    const subtotal = item.quantity * item.price;

    // Update the Orders totalAmount
    await db.run(
      `UPDATE Orders
       SET totalAmount = totalAmount - ?
       WHERE orderId = ?`,
      [subtotal, orderId]
    );

    // Delete the order item
    await db.run(
      `DELETE FROM OrderItems 
       WHERE orderItemId = ? AND orderId = ?`,
      [orderItemId, orderId]
    );

    res.status(200).send({ message: "Order item deleted and total updated successfully" });
  } catch (err) {
    console.error("Error deleting order item:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete all order items for this order
app.delete('/orders/:orderId/items', async (req, res) => {
  const { orderId } = req.params;
  try {
    // Delete all order items for this order
    await db.run(`DELETE FROM OrderItems WHERE orderId = ?`, [orderId]);

    res.status(200).send({ message: "All order items deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports=app;