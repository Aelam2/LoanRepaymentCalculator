import React from "react";
import { FormattedMessage } from "react-intl";
import { LockTwoTone, UserOutlined } from "@ant-design/icons";
import styles from "./UserSignInPage.module.scss";

export default {
  UserName: {
    form: {
      id: "UserName",
      name: "UserName",
      placeholder: "admin",
      rules: [
        {
          required: true,
          message: <FormattedMessage id="userName.required" defaultMessage="Please enter username!" />
        }
      ]
    },
    input: {
      size: "large",
      prefix: <UserOutlined className="site-form-item-icon" style={{ color: "#1890ff" }} className={styles.prefixIcon} />
    }
  },
  Password: {
    form: {
      id: "Password",
      name: "Password",
      type: "password",
      placeholder: "888888",
      rules: [
        {
          required: true,
          message: <FormattedMessage id="password.required" defaultMessage="Please enter password!" />
        }
      ]
    },
    input: {
      size: "large",
      prefix: <LockTwoTone className="site-form-item-icon" className={styles.prefixIcon} />,
      type: "password"
    }
  }
};
