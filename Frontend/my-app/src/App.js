import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import CustomerForm from "./components/Customer/CustomerForm";
import CustomerManagement from "./components/Customer/CustomerManagement";
import Navbar from "./components/Navbar";
import OrdersManagement from './components/Orders/OrdersManagement'
import OrderForm from "./components/Orders/OrderForm";

// Orders placeholder (will build later)
const Orders = () => <h2>Orders Page Coming Soon...</h2>;

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/customers" component={CustomerManagement} />
          <Route exact path="/newCustomer" component={CustomerForm} />
          <Route exact path="/orders" component={OrdersManagement} />
          <Route exact path="/newOrder" component={OrderForm}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
