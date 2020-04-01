import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/DashboardActions";

import { Layout, Drawer } from "antd";

import Loans from "./Loans";
import LoansNew from "./LoansNew";
import PaymentPlans from "./PaymentPlans";
import PaymentPlansNew from "./PaymentPlansNew";
import styles from "./SiderMenu.module.scss";

const { Content, Sider } = Layout;

class SideMenu extends React.Component {
  openDrawer = async item => {
    await this.props.toggleAddEditDrawer(true, item);
  };

  closeDrawer = async () => {
    await this.props.toggleAddEditDrawer(false, null);
  };

  render() {
    let { children, theme, drawer } = this.props;

    let drawerOpen = drawer.visible && styles.drawerOpen;

    return (
      <Layout className={`${styles.layout} ${drawerOpen}`}>
        <Sider className={`${styles.sider}`} theme={theme}>
          <Loans openDrawer={this.openDrawer} />
          <PaymentPlans openDrawer={this.openDrawer} />
        </Sider>
        <Drawer
          className={styles.addItemDrawer}
          title={null}
          placement="left"
          visible={drawer.visible}
          onClose={this.closeDrawer}
          closable={false}
          getContainer={false}
          width={450}
          zIndex={10}
          bodyStyle={{ padding: "0px" }}
        >
          {drawer.item == "loans" && <LoansNew closeDrawer={this.closeDrawer} />}
          {drawer.item == "payment-plans" && <PaymentPlansNew closeDrawer={this.closeDrawer} />}
        </Drawer>
        <Content className={`main-content ${styles.content}`}>{children}</Content>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    drawer: state.dashboard.drawer,
    theme: state.user.settings.theme
  };
};

export default compose(connect(mapStateToProps, actions))(SideMenu);
