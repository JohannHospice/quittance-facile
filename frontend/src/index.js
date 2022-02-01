import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ReceiptPage from "./pages/Receipt";
import LeasePage from "./pages/Lease";
import TenantPage from "./pages/Tenant";
import UserProvider, { LoginRoute } from "./providers/LoginProvider";

export const path = {
  quittance: "/quittances",
  bails: "/bails",
  locataires: "/locataires",
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <UserProvider>
          <Routes>
            <Route path="/" element={<LoginRoute />}>
              <Route path="/" element={<Navigate to={path.quittance} />} />
              <Route path={path.quittance} element={<ReceiptPage />} />
              <Route path={path.bails} element={<LeasePage />} />
              <Route path={path.locataires} element={<TenantPage />} />
            </Route>
          </Routes>
        </UserProvider>
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
