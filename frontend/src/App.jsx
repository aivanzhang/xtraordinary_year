import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout";
import "./App.css";
import Year from "./Year";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <ToastContainer />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Year />} />
            {/* <Route index element={<Landing />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="check_data" element={<CheckData />} />
            <Route path="error" element={<Error />} /> */}
          </Route>
          {/* <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="check_data" element={<CheckData />} />
            <Route path="error" element={<Error />} />
          </Route>
          <Route path="/" element={<AuthLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="run/:patrolId/:runId" exact element={<RunPage />} />
            <Route path="profile/:profileId" exact element={<ProfilePage />} />
            <Route
              path="data_quality_report"
              exact
              element={<DataQualityReport />}
            />
          </Route>
          <Route path="/public/:publicId" element={<Layout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="run/:patrolId/:runId" exact element={<RunPage />} />
            <Route path="profile/:profileId" exact element={<ProfilePage />} />
            <Route
              path="data_quality_report"
              exact
              element={<DataQualityReport />}
            />
          </Route> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
