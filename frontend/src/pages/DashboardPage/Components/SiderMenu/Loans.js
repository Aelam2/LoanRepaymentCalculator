import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/UserActions";

import { Button } from "antd";
import styles from "./SiderMenu.module.scss";

class Loans extends React.Component {
  render() {
    let { openDrawer } = this.props;
    return (
      <div className={styles.viewSection}>
        <div className={styles.header}>
          <h3 className={styles.title}>My Loans</h3>
          <Button type="primary" className={styles.btn} onClick={() => openDrawer("loans")}>
            + Add Loan
          </Button>
        </div>
        <div className={styles.list}></div>
      </div>
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

export default compose(connect(mapStateToProps, actions))(Loans);
