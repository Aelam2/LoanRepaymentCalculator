import React from "react";
import { Link } from "react-router-dom";
import { injectIntl, FormattedMessage } from "react-intl";
import { Form, Button, Input, Popover, Progress, message } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/UserActions";
import SignUpMaps from "./FormMap";
import styles from "./UserSignUpPage.module.scss";

class UserSignUpPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordPopover: false,
      visible: false,
      prefix: "86",
      confirmDirty: false
    };

    this.formRef = React.createRef();
  }

  onFinish = async values => {
    // Field used for validating password, but doesn't need sent to server
    delete values.ConfirmPassword;

    // Start sign-up action
    let result = await this.props.localSignUp(values);
    if (result) message.success("Sign in successful!");
  };

  getPasswordStatus = () => {
    const value = this.formRef.current && this.formRef.current.getFieldValue("Password");
    if (value && value.length > 12) {
      return "ok";
    }
    if (value && value.length > 8) {
      return "pass";
    }
    return "poor";
  };

  checkPassword = (_, value) => {
    const promise = Promise;
    let { passwordPopover, visible, confirmDirty } = this.state;

    // No value provided
    if (!value) {
      this.setState({ visible: !!value });
      return promise.reject("Please enter your password!");
    }
    // Valuable situation
    if (!visible) {
      this.setState({ visible: !!value });
    }

    this.setState({ passwordPopover: !passwordPopover });

    if (value.length < 6) {
      return promise.reject("Must be atleast 8 characters");
    }

    if (value && confirmDirty) {
      this.formRef.current.validateFields(["confirmPassword"]);
    }

    return promise.resolve();
  };

  checkConfirmPassword = (_, value) => {
    const promise = Promise;
    if (value && value !== this.formRef.current.getFieldValue("Password")) {
      return promise.reject("The passwords entered twice do not match!");
    }
    return promise.resolve();
  };

  changePrefix = value => {
    this.setState({
      prefix: value
    });
  };

  renderPasswordProgress = () => {
    const value = this.formRef.current && this.formRef.current.getFieldValue("Password");
    const passwordStatus = this.getPasswordStatus();

    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={SignUpMaps.passwordProgress[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    let { intl } = this.props;
    let { loading, isMobile } = this.props;
    let { visible } = this.state;

    return (
      <div className={`${styles.main}`}>
        <h3>Register</h3>
        <Form name="UserRegister" ref={this.formRef} onFinish={this.onFinish}>
          <Form.Item {...SignUpMaps.UserName.form}>
            <Input {...SignUpMaps.UserName.input} placeholder={`${intl.formatMessage({ id: "userName.placeholder", defaultMessage: "Username" })} *`} />
          </Form.Item>
          <Popover
            getPopupContainer={node => {
              if (node && node.parentNode) {
                return node.parentNode;
              }
              return node;
            }}
            content={
              visible && (
                <div style={{ padding: "6px 0" }}>
                  {SignUpMaps.passwordStatus[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FormattedMessage
                      id="sign.up.password.strength.details"
                      defaultMessage="Please enter at least 6 characters and don't use passwords that are easy to guess."
                    />
                  </div>
                </div>
              )
            }
            overlayStyle={{ width: 240 }}
            placement={"right"}
            visible={visible && !isMobile}
          >
            <Form.Item
              {...SignUpMaps.Password.form}
              className={
                this.formRef.current &&
                this.formRef.current.getFieldValue("Password") &&
                this.formRef.current.getFieldValue("Password").length > 0 &&
                styles.password
              }
              rules={[{ validator: this.checkPassword, ...SignUpMaps.Password.form.rules }]}
            >
              <Input {...SignUpMaps.Password.input} placeholder={`${intl.formatMessage({ id: "password.placeholder", defaultMessage: "Password" })} *`} />
            </Form.Item>
          </Popover>

          <Form.Item {...SignUpMaps.ConfirmPassword.form} rules={[{ validator: this.checkConfirmPassword, ...SignUpMaps.ConfirmPassword.form.rules }]}>
            <Input
              {...SignUpMaps.ConfirmPassword.input}
              placeholder={intl.formatMessage({ id: "confirm.password.placeholder", defaultMessage: "Confirm Password" })}
            />
          </Form.Item>
          <Form.Item {...SignUpMaps.Email.form}>
            <Input {...SignUpMaps.Email.input} placeholder={`${intl.formatMessage({ id: "email.placeholder", defaultMessage: "Email" })} *`} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item {...SignUpMaps.FirstName.form} style={{ display: "inline-block", width: "calc(50% - 5px)", marginRight: 8 }}>
              <Input {...SignUpMaps.FirstName.input} placeholder={intl.formatMessage({ id: "name.first.placeholder", defaultMessage: "First Name" })} />
            </Form.Item>
            <Form.Item {...SignUpMaps.LastName.form} style={{ display: "inline-block", width: "calc(50% - 5px)" }}>
              <Input {...SignUpMaps.LastName.input} placeholder={intl.formatMessage({ id: "name.last.placeholder", defaultMessage: "Last Name" })} />
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button size="large" className={styles.submit} type="primary" htmlType="submit" loading={loading}>
              <FormattedMessage id="sign.up.submit.text" defaultMessage="Register" />
            </Button>
            <Link className={`${styles.login} secondary-text`} to="/user/sign-in">
              <FormattedMessage id="sign.up.account.exists.text" defaultMessage="Already have an account?" />
            </Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isMobile: state.site.isMobile,
    token: state.auth.token,
    loading: state.auth.signUp.loading,
    error: state.auth.signUp.error
  };
};

export default compose(connect(mapStateToProps, actions))(injectIntl(UserSignUpPage));
