import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class AuthGuard extends React.Component {
  componentDidMount = () => {
    // Allow user to visit password-reset page
    if (!this.props.history.location.pathname.includes("/user/password-reset")) {
      if (!this.props.isAuth && !this.props.jwtToken) {
        this.props.history.push("/user/sign-in");
      }
    }
  };

  componentDidUpdate = prevProps => {
    // Allow user to visit password-reset page
    if (!this.props.history.location.pathname.includes("/user/password-reset")) {
      if (prevProps.isAuth && !this.props.isAuth) {
        this.props.history.push("/user/sign-in");
      }

      if (!prevProps.isAuth && this.props.isAuth) {
        this.props.history.push("/");
      }
    }
  };

  render() {
    let { isAuth, jwtToken, children } = this.props;
    return children(isAuth, jwtToken);
  }
}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuthenticated,
    jwtToken: state.auth.token
  };
};

export default connect(mapStateToProps, null)(withRouter(AuthGuard));
