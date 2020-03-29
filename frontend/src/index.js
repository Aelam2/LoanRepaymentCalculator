import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// Redux Imports
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import reducers from "./reducers";

//Internationalization and pollyfills
import { IntlProvider } from "react-intl";
import translationsForUsersLocale from "locales";
import "intl";
import "date-time-format-timezone";

import App from "./pages/App";
import * as serviceWorker from "./serviceWorker";
import AxiosGlobalSettings from "utils/axios";
import "antd/dist/antd.css";
import "index.module.scss";

AxiosGlobalSettings();

const browserLocale = navigator.language;
let jwtToken = localStorage.getItem("JWT_TOKEN");

ReactDOM.render(
  <Provider
    store={createStore(
      reducers,
      {
        auth: {
          isAuthenticated: jwtToken ? true : false,
          token: jwtToken
        }
      },
      applyMiddleware(reduxThunk)
    )}
  >
    <IntlProvider locale={browserLocale} defaultLocale="en-US" messages={translationsForUsersLocale[browserLocale]}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
