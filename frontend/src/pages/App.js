import React from "react";
import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";

import LayoutAuthorized from "components/LayoutAuthorized";
import LayoutUnAuthorized from "components/LayoutUnAuthorized";
import DashboardPage from "pages/DashboardPage";
import PaymentSchedulePage from "pages/PaymentSchedulePage";
import ResourcesPage from "pages/ResourcesPage";
import UserProfilePage from "pages/UserProfilePage";
import UserSignInPage from "pages/UserSignInPage";
import UserSignUpPage from "pages/UserSignUpPage";

import "./App.module.scss";

class App extends React.Component {
  componentDidMount = () => {
    if (!this.props.isAuthenticated) {
      this.props.history.push("/user/sign-in");
    }
  };

  componentDidUpdate = prevProps => {
    if (prevProps.isAuthenticated === true && this.props.isAuthenticated === false) {
      this.props.history.push("/user/sign-in");
    }
  };

  render() {
    let { isAuthenticated, token } = this.props;
    console.log(isAuthenticated, token);

    if (isAuthenticated || token) {
      return (
        <LayoutAuthorized>
          <Route path="/" component={DashboardPage} />
          <Route path="/payment-schedule" component={PaymentSchedulePage} />
          <Route path="/resources" component={ResourcesPage} />
          <Route path="/user/profile" component={UserProfilePage} />
        </LayoutAuthorized>
      );
    }

    return (
      <LayoutUnAuthorized>
        <Route path="/user/sign-in" component={UserSignInPage} />
        <Route path="/user/sign-up" component={UserSignUpPage} />
      </LayoutUnAuthorized>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token
  };
};

export default compose(connect(mapStateToProps, null))(withRouter(App));
