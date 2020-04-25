import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/UserActions";
import FormMap from "pages/UserSignUpPage/FormMap";
import { Form, Input, Button, message, Progress, Popover, Spin } from "antd";
import styles from "./UserPasswordReset.module.scss";

class PasswordForm extends React.Component {
  state = {
    passwordPopover: false,
    visible: false,
    prefix: "86",
    confirmDirty: false
  };
  formRef = React.createRef();

  componentDidMount() {
    let token = this.props.match.params.token;
    this.props.getPasswordResetDetails(token);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetFetch.error == false && this.props.resetFetch.error == true) {
      message.error("Password reset link has expired. Please request a new email.");
      this.props.history.push("/user/sign-in");
    }

    if (prevProps.resetSubmit.success == false && this.props.resetSubmit.success == true) {
      message.success(`Password was successfully reset for ${this.props.resetFetch.data.Email}`);
      this.props.history.push("/user/sign-in");
    }

    if (prevProps.resetSubmit.error == false && this.props.resetSubmit.error == true) {
      message.success(`An unexpected error occured.`);
      this.props.history.push("/user/sign-in");
    }

    if (prevProps.resetFetch.data.Email !== this.props.resetFetch.data.Email) {
      if (this.formRef.current) {
        this.formRef.current.setFieldsValue({
          Email: this.props.resetFetch.data.Email
        });
      }
    }
  }

  onFinish = async values => {
    delete values.ConfirmPassword;

    // Start set password action
    await this.props.setNewPassword(this.props.match.params.token, values);
  };

  getPasswordStatus = () => {
    const value = this.formRef.current && this.formRef.current.getFieldValue("Password");
    if (value && value.length > 12) {
      return "ok";
    }
    if (value && value.length >= 8) {
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
        <Progress status={FormMap.passwordProgress[passwordStatus]} className={styles.progress} strokeWidth={6} percent={value.length * 7.5} showInfo={false} />
      </div>
    ) : null;
  };

  render() {
    let { intl, resetFetch, resetSubmit, isMobile } = this.props;
    let { visible } = this.state;

    if (resetFetch.loading) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spin></Spin>
        </div>
      );
    }

    return (
      <div className={`${styles.container}`}>
        <FormattedMessage id="password.set.title" defaultMessage="Password Reset" tagName="h1" />
        <Form name="reset-form" ref={this.formRef} onFinish={this.onFinish}>
          <Form.Item {...FormMap.Email.form}>
            <Input {...FormMap.Email.input} placeholder={`${intl.formatMessage({ id: "email.placeholder", defaultMessage: "Email" })} *`} disabled={true} />
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
                  {FormMap.passwordStatus[this.getPasswordStatus()]}
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
              {...FormMap.Password.form}
              className={
                this.formRef.current &&
                this.formRef.current.getFieldValue("Password") &&
                this.formRef.current.getFieldValue("Password").length > 0 &&
                styles.password
              }
              rules={[{ validator: this.checkPassword, ...FormMap.Password.form.rules }]}
            >
              <Input {...FormMap.Password.input} placeholder={`${intl.formatMessage({ id: "password.placeholder", defaultMessage: "Password" })} *`} />
            </Form.Item>
          </Popover>

          <Form.Item {...FormMap.ConfirmPassword.form} rules={[{ validator: this.checkConfirmPassword, ...FormMap.ConfirmPassword.form.rules }]}>
            <Input {...FormMap.ConfirmPassword.input} placeholder={intl.formatMessage({ id: "confirm.password.placeholder", defaultMessage: "Reset" })} />
          </Form.Item>
          <Form.Item>
            <Form.Item style={{ float: "right" }}>
              <Button size="large" className={styles.submit} type="primary" htmlType="submit" loading={resetSubmit.loading} style={{ minWidth: "103px" }}>
                {!resetSubmit.loading && <FormattedMessage id="password.set.button" defaultMessage="Reset" />}
              </Button>
            </Form.Item>

            <Link className={`secondary-text`} style={{ float: "left" }} to="/user/sign-in">
              <FormattedMessage id="password.reset.back" defaultMessage="Back to Login" />
            </Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isMobile: state.site.isMobile,
    resetFetch: state.auth.resetPasswordForm,
    resetSubmit: state.auth.resetPasswordFormSubmit
  };
};

export default compose(connect(mapStateToProps, actions))(injectIntl(PasswordForm));
