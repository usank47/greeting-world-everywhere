import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NewOrder from "./pages/NewOrder";
import PriceList from "./pages/PriceList";
import OrderHistory from "./pages/OrderHistory";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <div>
      <h1>Testing Basic Render</h1>
      <p>If you see this, React is working</p>
    </div>
  );
};

export default App;
