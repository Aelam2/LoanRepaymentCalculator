import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/UserActions";

import { Button } from "antd";
import styles from "./SiderMenu.module.scss";

class PaymentPlansNew extends React.Component {
  savePlan = plan => {};

  render() {
    let { closeDrawer } = this.props;

    return (
      <div className={styles.editSection}>
        <div className={styles.header}>
          <h3 className={styles.title}>New Plan</h3>
          <div className={styles.actions}>
            <Button type="primary" className={styles.btnSmall}>
              Save
            </Button>
            <Button type="primary" className={styles.btnSmall} onClick={closeDrawer}>
              Cancel
            </Button>
          </div>
        </div>
        <div className={styles.list}></div>
      </div>
    );
  }
}

export default PaymentPlansNew;
