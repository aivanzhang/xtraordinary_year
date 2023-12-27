import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout";
import "./App.css";
import Year from "./Year";
import Landing from "./Landing";
import Pending from "./Pending";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <ToastContainer />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="year/:username" element={<Year />} />
            <Route path="pending/:username" element={<Pending />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
