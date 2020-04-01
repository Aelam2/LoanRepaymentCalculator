import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// Redux Imports
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import reducers, { defaultAuthState, defaultUserState } from "./reducers";

//Internationalization and pollyfills
import LocaleProvider from "components/LocaleProvider";
import "intl";
import "date-time-format-timezone";

import ThemeProvider from "components/ThemeProvider";

import App from "./pages/App";
import * as serviceWorker from "./serviceWorker";
import AxiosGlobalSettings from "utils/axios";
import "antd/dist/antd.css";
import "index.module.scss";

AxiosGlobalSettings();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let jwtToken = localStorage.getItem("JWT_TOKEN");
let siteLocale = localStorage.getItem("SITE_LOCALE") || "en-US";
let siteTheme = localStorage.getItem("SITE_THEME") || "light";

ReactDOM.render(
  <Provider
    store={createStore(
      reducers,
      {
        auth: {
          ...defaultAuthState,
          isAuthenticated: jwtToken ? true : false,
          token: jwtToken
        },
        user: {
          ...defaultUserState,
          settings: {
            ...defaultUserState.settings,
            locale: siteLocale,
            theme: siteTheme
          }
        }
      },
      composeEnhancer(applyMiddleware(reduxThunk))
    )}
  >
    <LocaleProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </LocaleProvider>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
