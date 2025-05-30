import './thankyou.css'
export default function ThankYou() {

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <div className="checkmark">
          <span className="checkmark-icon">✓</span>
        </div>

        <h1 className="thank-you-title">Thank You for Your Purchase!</h1>

        <p className="thank-you-subtitle">
          Your order has been successfully processed. You should receive a
          confirmation email shortly.
        </p>

        <button
          className="continue-button"
          onClick={() => (window.location.href = "/")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
