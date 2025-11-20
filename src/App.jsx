import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Booking from './pages/Booking';
import { initMetaPixel } from './utils/metaPixel';

function App() {
  // Initialize Meta Pixel on app mount
  useEffect(() => {
    const pixelId = import.meta.env.VITE_META_PIXEL_ID;
    if (pixelId) {
      initMetaPixel(pixelId);
    } else {
      console.warn('Meta Pixel ID not configured. Add VITE_META_PIXEL_ID to your .env.local file.');
    }
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
