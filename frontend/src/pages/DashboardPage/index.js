import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/DashboardActions";
import { TabBar } from "antd-mobile";
import { Layout, Drawer } from "antd";
import { FolderOpenOutlined, FallOutlined, ScheduleOutlined } from "@ant-design/icons";
import { Overview, Loans, PaymentPlans, LoansDrawer, PaymentPlansDrawer } from "pages/DashboardPage/Components";
import styles from "./DashboardPage.module.scss";

const { Sider } = Layout;

class DashboardPage extends React.Component {
  componentDidMount = async () => {
    try {
      if (!this.props.loans.data.length && !this.props.paymentPlans.data.length) {
        await Promise.all([this.props.fetchLoans(), this.props.fetchPaymentPlans()]);
      }
    } catch (err) {
      return;
    }
  };

  mobileTabChange = async tab => {
    await this.props.toggleAddEditDrawer(false, null, null);
    await this.props.handleMobileTabChange(tab);
  };

  toggleListAccordion = async (type, isOpen) => {
    await this.props.toggleListAccordion(type, isOpen);
  };

  toggleHideLoan = async (LoanID, hidden) => {
    if (!hidden) {
      await this.props.hideLoan(LoanID);
    } else {
      await this.props.unHideLoan(LoanID);
    }

    await this.props.fetchAmortizationSchedule(this.props.loans.data.filter(l => l.hidden).map(l => l.LoanID));
  };

  openDrawer = async (type, item) => {
    await this.props.toggleAddEditDrawer(true, null, null);
    await this.props.toggleAddEditDrawer(true, type, item);
  };

  closeDrawer = async () => {
    await this.props.toggleAddEditDrawer(false, null, null);
  };

  toggleCurrentPlan = async (PaymentPlanID, IsCurrent) => {
    await this.props.toggleCurrentPlan(PaymentPlanID, IsCurrent);
    await this.props.fetchAmortizationSchedule(this.props.loans.data.filter(l => l.hidden).map(l => l.LoanID));
  };

  render() {
    let { isMobile, drawer, theme, width, loans, paymentPlans } = this.props;
    let isDark = theme === "dark" ? true : false;

    if (isMobile) {
      let { mobileTab } = this.props;

      return (
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#fff"
          barTintColor={isDark ? "#141414" : "#3E587B"}
          prerenderingSiblingsNumber={0}
          hidden={drawer.visible}
        >
          <TabBar.Item
            title="Dashboard"
            key="dashboard"
            icon={<FallOutlined style={{ color: "#949494" }} />}
            selectedIcon={<FallOutlined />}
            onPress={() => this.mobileTabChange("dashboard")}
            selected={mobileTab === "dashboard"}
          >
            <div className={`${styles.mobileTab} ${styles.dashboard}`}>
              <Overview />
            </div>
          </TabBar.Item>

          <TabBar.Item
            title="My Loans"
            key="loans"
            className="test"
            icon={<FolderOpenOutlined style={{ color: "#949494" }} />}
            selectedIcon={<FolderOpenOutlined />}
            onPress={() => this.mobileTabChange("loans")}
            selected={mobileTab === "loans"}
          >
            <div className={`${styles.mobileTab} ${styles.loans}`}>
              <Drawer
                className={styles.mobileAddItemDrawer}
                title={null}
                placement="left"
                visible={drawer.visible}
                onClose={this.closeDrawer}
                closable={false}
                getContainer={false}
                width={width}
                zIndex={10}
                bodyStyle={{ padding: "0px" }}
                drawerStyle={{ posiiton: "relative" }}
              >
                <LoansDrawer
                  closeDrawer={this.closeDrawer}
                  item={drawer.item}
                  visible={drawer.visible}
                  isSaving={loans.creating || loans.updating}
                  isDeleting={loans.deleting}
                  loans={loans.data}
                />
              </Drawer>

              <Loans
                containerName={styles.loansSection}
                headerClassName={styles.header}
                bodyClassName={styles.body}
                openDrawer={this.openDrawer}
                toggleHideLoan={this.toggleHideLoan}
                data={loans.data}
                loading={loans.loading || paymentPlans.loading}
                error={loans.error || paymentPlans.error}
              />
            </div>
          </TabBar.Item>

          <TabBar.Item
            title="My Plans"
            key="plans"
            icon={<ScheduleOutlined style={{ color: "#949494" }} />}
            selectedIcon={<ScheduleOutlined />}
            onPress={() => this.mobileTabChange("plans")}
            selected={mobileTab === "plans"}
          >
            <div className={`${styles.mobileTab} ${styles.paymentPlans}`}>
              <Drawer
                className={styles.mobileAddItemDrawer}
                title={null}
                placement="left"
                visible={drawer.visible}
                onClose={this.closeDrawer}
                closable={false}
                getContainer={false}
                width={width}
                zIndex={10}
                bodyStyle={{ padding: "0px" }}
                drawerStyle={{ posiiton: "relative" }}
              >
                <PaymentPlansDrawer
                  closeDrawer={this.closeDrawer}
                  item={drawer.item}
                  visible={drawer.visible}
                  isSaving={paymentPlans.creating || paymentPlans.updating}
                  isDeleting={paymentPlans.deleting}
                />
              </Drawer>

              <PaymentPlans
                toggleCurrentPlan={this.toggleCurrentPlan}
                containerName={styles.paymentPlansSection}
                headerClassName={styles.header}
                bodyClassName={styles.body}
                openDrawer={this.openDrawer}
                data={paymentPlans.data}
                loading={loans.loading || paymentPlans.loading}
                error={loans.error || paymentPlans.error}
              />
            </div>
          </TabBar.Item>
        </TabBar>
      );
    } else {
      return (
        <div className={`${styles.layout} ${drawer.visible && styles.drawerOpen}`}>
          <Sider className={`${styles.sider}`} theme={theme}>
            <Loans
              isOpen={loans.isOpen}
              toggleListAccordion={this.toggleListAccordion}
              toggleHideLoan={this.toggleHideLoan}
              openDrawer={this.openDrawer}
              data={loans.data}
              loading={loans.loading || paymentPlans.loading}
              error={loans.error}
            />
            <PaymentPlans
              isOpen={paymentPlans.isOpen}
              toggleCurrentPlan={this.toggleCurrentPlan}
              toggleListAccordion={this.toggleListAccordion}
              openDrawer={this.openDrawer}
              data={paymentPlans.data}
              loading={loans.loading || paymentPlans.loading}
              error={paymentPlans.error}
            />
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
            drawerStyle={{ posiiton: "relative" }}
          >
            {drawer.type == "loans" && (
              <LoansDrawer
                closeDrawer={this.closeDrawer}
                item={drawer.item}
                visible={drawer.visible}
                isSaving={loans.creating || loans.updating}
                isDeleting={loans.deleting}
                loans={loans.data}
              />
            )}
            {drawer.type == "paymentPlans" && (
              <PaymentPlansDrawer
                closeDrawer={this.closeDrawer}
                item={drawer.item}
                visible={drawer.visible}
                isSaving={paymentPlans.creating || paymentPlans.updating}
                isDeleting={paymentPlans.deleting}
              />
            )}
          </Drawer>
          <div className={`${styles.content}`}>
            <Overview />
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    isMobile: state.site.isMobile,
    theme: state.site.theme,
    width: state.site.width,
    mobileTab: state.dashboard.mobileTab,
    drawer: state.dashboard.drawer,
    loans: state.dashboard.loans,
    paymentPlans: state.dashboard.paymentPlans
  };
};

export default compose(connect(mapStateToProps, actions))(DashboardPage);
