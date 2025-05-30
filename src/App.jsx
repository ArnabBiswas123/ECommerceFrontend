// import './App.css'
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer } from 'react-toastify';
import ThankYou from "./pages/Thankyou";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        <Route path="/dashboard" element={<AdminDashboard></AdminDashboard>}></Route>
        <Route path="/thank-you" element={<ThankYou></ThankYou>}></Route>
      </Routes>
        <ToastContainer />
    </>
  );
}

export default App;
