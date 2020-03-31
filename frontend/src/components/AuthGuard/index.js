import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class AuthGuard extends React.Component {
  componentDidMount = () => {
    if (!this.props.isAuth && !this.props.jwtToken) {
      this.props.history.push("/user/sign-in");
    }
  };

  componentDidUpdate = prevProps => {
    if (prevProps.isAuth && !this.props.isAuth) {
      this.props.history.push("/user/sign-in");
    }

    if (!prevProps.isAuth && this.props.isAuth) {
      this.props.history.push("/");
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
