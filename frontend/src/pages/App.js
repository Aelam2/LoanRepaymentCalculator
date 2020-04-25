import React from "react";
import { Route } from "react-router-dom";
import debounce from "lodash/debounce";
import { connect } from "react-redux";
import { compose } from "redux";

import * as userActions from "actions/UserActions";
import * as siteActions from "actions/SiteActions";

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
import PasswordResetEmailForm from "pages/UserPasswordReset/EmailForm";
import PasswordResetPasswordForm from "pages/UserPasswordReset/PasswordForm";
import TermsAndConditions from "pages/Policies/TermsAndConditions";

import "./App.scss";

class App extends React.Component {
  componentDidMount = () => {
    window.addEventListener(
      "resize",
      debounce(() => this.props.updateWindowSize(window.innerWidth), 200)
    );
  };

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
    let { isMobile } = this.props;

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
                <Route path="/user/password-reset" component={PasswordResetEmailForm} exact />
                <Route path="/user/password-reset/:token" component={PasswordResetPasswordForm} exact />
                <Route path="/terms-and-conditions" component={TermsAndConditions} exact />
              </LayoutUnAuthorized>
            );
          } else {
            return (
              <LayoutAuthorized
                className="content-container"
                isMobile={isMobile}
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
                <Route path="/user/password-reset" component={PasswordResetEmailForm} exact />
                <Route path="/user/password-reset/:token" component={PasswordResetPasswordForm} exact />
                <Route path="/terms-and-conditions" component={TermsAndConditions} exact />
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
    locale: state.site.locale,
    theme: state.site.theme,
    isMobile: state.site.isMobile
  };
};

export default compose(connect(mapStateToProps, { ...userActions, ...siteActions }))(App);
