import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>Qwipo CRM</h1>
      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/customers" style={styles.link}>Customers</Link></li>
        <li><Link to="/orders" style={styles.link}>Orders</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    background: "#2563eb",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
  },
  logo: { margin: 0, fontSize: "20px" },
  links: { display: "flex", listStyle: "none", gap: "15px", margin: 0 },
  link: { color: "#fff", textDecoration: "none", fontWeight: "bold" }
};

export default Navbar;
