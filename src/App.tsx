import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
import NewOrder from "./pages/NewOrder";
import PriceList from "./pages/PriceList";
import OrderHistory from "./pages/OrderHistory";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><PriceList /></Layout>} />
        <Route path="/new-order" element={<Layout><NewOrder /></Layout>} />
        <Route path="/order-history" element={<Layout><OrderHistory /></Layout>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
