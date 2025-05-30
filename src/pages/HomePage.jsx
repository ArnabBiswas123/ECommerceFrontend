import React, { useEffect, useState } from "react";
import "./homestyles.css";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);
import { useNavigate } from "react-router-dom";


const handleBuyNow = async (product) => {
  try {

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}api/v1/route/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.msg || "Failed to create checkout session");
    }

    const { sessionId } = await response.json();

    
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error("Stripe redirect error:", error.message);

    }
  } catch (err) {
    console.error("Error in handleBuyNow:", err.message);
  }
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const navigate=useNavigate()

  useEffect(() => {
    fetchproducts();
  }, []);
  const fetchproducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/route/getallproducts`
      );
      const res = await response.json();
      if (res.success === true) {
        setProducts(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">TechStore</h1>
        <p className="subtitle">Your one-stop shop for electronics</p>
        <button className="logout-btn" onClick={()=>{navigate('/login')}}>Login</button>
      </header>
 
      <main className="main">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="image-container">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-images"
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <button
                  className="buy-button"
                  onClick={() => handleBuyNow(product)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 TechStore. All rights reserved.</p>
      </footer>
    </div>
  );
}
