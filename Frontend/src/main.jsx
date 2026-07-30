import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import  {Provider} from "react-redux"
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";
import { store } from "./app/store.js";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <Provider store={store}>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <App />
      </Provider>
    </StrictMode>
    ,
  </BrowserRouter>,
);
