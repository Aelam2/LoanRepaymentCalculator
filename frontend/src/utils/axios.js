import axios from "axios";
import { notification } from "antd";

axios.defaults.baseURL = `${process.env.REACT_APP_API_BASE_URL}`;
axios.defaults.headers.post["Content-Type"] = "application/json";

const isHandlerDisabled = (config = {}) => {
  return config.hasOwnProperty("handlerEnabled") && config.handlerEnabled === false ? true : false;
};

const mergeCustomErrorCodeTitles = (config = {}) => {
  let codeTitles = {
    400: "Invalid Request",
    401: "Login Failed",
    403: "Unauthorized Access",
    404: "Resource not found: 404",
    406: "Format unavailable: 406",
    410: "Error: 410",
    422: "Invalid Input!",
    500: "Server Error: 500",
    502: "Gateway error: 502",
    503: "Sever Unavailable: 503",
    504: "Request Timeout: 504"
  };

  if (config.hasOwnProperty("codeTitles") && Object.keys(config.codeTitles).length) {
    codeTitles = Object.assign({}, codeTitles, config.codeTitles);
  }

  return codeTitles;
};

const mergeCustomErrorCodeMessages = (config = {}) => {
  let codeMessages = {
    400: "There was an error in the request, and the server did not create or modify data.",
    401: "The user does not have permissions (username, password incorrect).",
    403: "The user is authorized, but access is prohibited.",
    404: "The requested resource does not exist or has been deleted.",
    406: "The requested format is not available.",
    410: "The requested resource is permanently deleted and is no longer available.",
    422: "Requested input was invalid, and no data was modified",
    500: "A server error occurred. Please email James@alexelam.dev if the problem persists",
    502: "Gateway error.",
    503: "The service is unavailable and the server is temporarily overloaded or maintained.",
    504: "Gateway timed out."
  };

  if (config.hasOwnProperty("codeMessages") && Object.keys(config.codeMessages).length) {
    codeMessages = Object.assign({}, codeMessages, config.codeMessages);
  }

  return codeMessages;
};

// Don't trigger interceptor on site INIT
let interceptorActive = false;

// Add axios interceptor for error handling
axios.interceptors.response.use(
  response => {
    // Continue with response if status in 2xx range'
    return response;
  },
  error => {
    if (!interceptorActive) { interceptorActive = true; return; } //prettier-ignore

    if (!isHandlerDisabled(error.config)) {
      let codeTitles = mergeCustomErrorCodeTitles(error.config);
      let codeMessages = mergeCustomErrorCodeMessages(error.config);

      const { response } = error;
      if (response && response.status) {
        const { status } = response;

        const errorTitle = codeTitles[status] || `Error ${status}`;
        // If error message is provided by server otherwise use generic message
        const errorText = response.data.error || codeMessages[status] || "An unexpected error occured";

        // Display status code and error message to user.
        notification.error({
          message: errorTitle,
          description: errorText
        });
      } else if (!response) {
        // If there was no response from server.
        notification.error({
          message: "Network Error",
          description: "Your network was unable to connect to our server. Please try again soon."
        });
      }
    }

    // return error for further handling
    return Promise.reject(error);
  }
);

export default axios;
