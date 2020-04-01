import React from "react";
import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/UserActions";

import { message } from "antd";
import topNavMap from "config/topNavMap";
import sideNavMap from "config/sideNavMap";

import AuthGuard from "components/AuthGuard";
import LayoutAuthorized from "components/LayoutAuthorized";
import LayoutUnAuthorized from "components/LayoutUnAuthorized";
import DashboardPage from "pages/DashboardPage";
import PaymentSchedulePage from "pages/PaymentSchedulePage";
import ResourcesPage from "pages/ResourcesPage";
import UserProfilePage from "pages/UserProfilePage";
import UserSignInPage from "pages/UserSignInPage";
import UserSignUpPage from "pages/UserSignUpPage";

import "./App.scss";

class App extends React.Component {
  signOutUser = async () => {
    let result = await this.props.signOutUser();
    if (result) message.success("Sign out successful!");
  };

  onLocaleChange = async value => {
    await this.props.changeSiteLocale(value.key);
  };

  onThemeChange = async theme => {
    await this.props.changeSiteTheme(theme);
  };

  render() {
    return (
      <AuthGuard>
        {(isAuth, token) => {
          if (!isAuth || !token) {
            return (
              <LayoutUnAuthorized
                onLocaleChange={this.onLocaleChange}
                selectedLocale={this.props.locale}
                onThemeChange={this.onThemeChange}
                selectedTheme={this.props.theme}
              >
                <Route path="/user/sign-in" component={UserSignInPage} />
                <Route path="/user/sign-up" component={UserSignUpPage} />
              </LayoutUnAuthorized>
            );
          } else {
            return (
              <LayoutAuthorized
                topNavLinks={topNavMap}
                sideNavLinks={sideNavMap}
                onSignOut={this.signOutUser}
                onLocaleChange={this.onLocaleChange}
                selectedLocale={this.props.locale}
                onThemeChange={this.onThemeChange}
                selectedTheme={this.props.theme}
              >
                <Route path="/" component={DashboardPage} exact />
                <Route path="/payment-schedule" component={PaymentSchedulePage} exact />
                <Route path="/resources" component={ResourcesPage} exact />
                <Route path="/user/profile" component={UserProfilePage} exact />
              </LayoutAuthorized>
            );
          }
        }}
      </AuthGuard>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token,
    locale: state.user.settings.locale,
    theme: state.user.settings.theme
  };
};

export default compose(connect(mapStateToProps, actions))(App);
