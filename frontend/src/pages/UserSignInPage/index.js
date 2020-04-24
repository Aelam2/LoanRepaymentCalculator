import React from "react";
import { Link } from "react-router-dom";
import { injectIntl, FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/UserActions";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Form, Input, Button, Checkbox, message } from "antd";
import { FacebookOutlined, GoogleOutlined, LoadingOutlined } from "@ant-design/icons";
import LoginFields from "./FormMap";
import styles from "./UserSignInPage.module.scss";

class UserSignInPage extends React.Component {
  state = {
    googleLoading: false,
    facebookLoading: false
  };

  formRef = React.createRef();

  setSocialLoading = (key, boolean) => {
    this.setState({
      [key]: boolean
    });
  };

  onFinish = async values => {
    // Start sign-in action
    let result = await this.props.localSignIn(values);
    if (result) message.success("Sign in successful!");
  };

  onGoogleLogin = async res => {
    console.log("responseGoogle", res.tokenObj.access_token);
    if (res.tokenObj && res.tokenObj.access_token) {
      let result = await this.props.oAuthGoogleSignIn(res.tokenObj.access_token);
      if (result) message.success("Sign in successful!");
    }

    this.setSocialLoading("googleLoading", false);
  };

  onFacebookLogin = async res => {
    console.log("responseFacebook", res.accessToken);
    if (res.accessToken) {
      let result = await this.props.oAuthFacebookSignIn(res.accessToken);
      if (result) message.success("Sign in successful!");
    }

    this.setSocialLoading("facebookLoading", false);
  };

  render() {
    let { intl } = this.props;
    let { loading } = this.props;
    let { facebookLoading, googleLoading } = this.state;

    return (
      <div className={`${styles.main} ${styles.login}`}>
        <Form name="local-login" ref={this.formRef} initialValues={{ remember: true }} onFinish={this.onFinish}>
          <Form.Item {...LoginFields.UserName.form}>
            <Input {...LoginFields.UserName.input} placeholder={intl.formatMessage({ id: "userName.placeholder", defaultMessage: "Username" })} />
          </Form.Item>
          <Form.Item {...LoginFields.Password.form}>
            <Input {...LoginFields.Password.input} placeholder={intl.formatMessage({ id: "password.placeholder", defaultMessage: "Password" })} />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>
                <FormattedMessage id="login.remember.me" defaultMessage="Remember me" />
              </Checkbox>
            </Form.Item>
            <a style={{ float: "right" }} className="secondary-text">
              <FormattedMessage id="login.forgot.password" defaultMessage="Forgot password" />
            </a>
          </Form.Item>
          <Form.Item className={styles.submitContainer}>
            <Button size="large" className={styles.submit} type="primary" htmlType="submit" loading={loading}>
              {!loading && <FormattedMessage id="login.login" defaultMessage="Login" />}
            </Button>
            <Link className={`${styles.register} secondary-text`} to="/user/sign-up">
              <FormattedMessage id="login.other.new" defaultMessage="Create New Account" />
            </Link>
          </Form.Item>

          <div className={styles.other}>
            <div className={styles.orSignUpDivider}>OR</div>
            <div className={styles.alternative}>
              <GoogleLogin
                clientId="395522895595-mg2923mps4fm0jlb9p9j3ag0hsfrrvlg.apps.googleusercontent.com"
                onSuccess={this.onGoogleLogin}
                onFailure={this.onGoogleLogin}
                cookiePolicy={"single_host_origin"}
                autoLoad={false}
                render={renderProps => (
                  <Button
                    size="large"
                    className={styles.socialMediaBtn}
                    icon={!googleLoading ? <GoogleOutlined /> : <LoadingOutlined />}
                    block={true}
                    onClick={() => {
                      this.setSocialLoading("googleLoading", true);
                      renderProps.onClick();
                    }}
                  >
                    <span className={styles.socialMediaBtnInnerText}>
                      <FormattedMessage id="login.other.google" defaultMessage="Continue with Google" />
                    </span>
                  </Button>
                )}
              />
              <FacebookLogin
                appId="649424762459082"
                fields="name, email, picture"
                callback={this.onFacebookLogin}
                cookie={true}
                isMobile={false}
                render={renderProps => (
                  <Button
                    size="large"
                    className={styles.socialMediaBtn}
                    icon={!facebookLoading ? <FacebookOutlined /> : <LoadingOutlined />}
                    block={true}
                    onClick={() => {
                      this.setSocialLoading("facebookLoading", true);
                      renderProps.onClick();
                    }}
                  >
                    <span className={styles.socialMediaBtnInnerText}>
                      <FormattedMessage id="login.other.facebook" defaultMessage="Continue with Facebook" />
                    </span>
                  </Button>
                )}
              />
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token,
    loading: state.auth.signIn.loading,
    error: state.auth.signIn.error
  };
};

export default compose(connect(mapStateToProps, actions))(injectIntl(UserSignInPage));
