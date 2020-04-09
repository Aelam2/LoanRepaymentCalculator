import React, { Suspense } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/DashboardActions";
import { Tabs } from "antd-mobile";
import { Layout, Drawer } from "antd";
import GridContent from "components/GridContent";
import PageLoading from "components/PageLoading";
import { Loans, PaymentPlans, AnalysisRow, ChartRow, DrawerLoans, DrawerPaymentPlans } from "./Components";
import styles from "./DashboardPage.module.scss";
import { visitData } from "__tests__/mockData/charts";

const { Sider } = Layout;

class DashboardPage extends React.Component {
  componentDidMount = async () => {
    await this.props.fetchLoans();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.mobileTab != this.props.mobileTab) {
    }
  };

  mobileTabChange = async (tab, index) => {
    await this.props.handleMobileTabChange(index);
    await this.props.toggleAddEditDrawer(false, null, null);
  };

  toggleListAccordion = async (type, isOpen) => {
    await this.props.toggleListAccordion(type, isOpen);
  };

  openDrawer = async (type, item) => {
    await this.props.toggleAddEditDrawer(true, type, item);
  };

  closeDrawer = async () => {
    await this.props.toggleAddEditDrawer(false, null, null);
  };

  render() {
    let { isMobile, drawer, theme, width, loans, paymentPlans } = this.props;
    let isDark = theme === "dark" ? true : false;

    if (isMobile) {
      let { mobileTab } = this.props;

      return (
        <Tabs
          tabs={[
            { title: "My Loans", sub: "1" },
            { title: "My Plans", sub: "2" },
            { title: "Dashboard", sub: "3" }
          ]}
          page={Number(mobileTab)}
          swipeable={false}
          tabBarPosition="bottom"
          renderTab={(tab) => <span>{tab.title}</span>}
          onChange={this.mobileTabChange}
          tabBarBackgroundColor={isDark ? "#141414" : "#3E587B"}
          style={{ height: "100%" }}
        >
          <div className={`${styles.mobileTab} ${styles.loans}`}>
            {mobileTab === 0 && (
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
                <DrawerLoans
                  closeDrawer={this.closeDrawer}
                  item={drawer.item}
                  visible={drawer.visible}
                  isSaving={loans.creating || loans.updating}
                  isDeleting={loans.deleting}
                />
              </Drawer>
            )}

            <Loans
              containerName={styles.loansSection}
              headerClassName={styles.header}
              bodyClassName={styles.body}
              openDrawer={this.openDrawer}
              data={loans.data}
              loading={loans.loading}
              error={loans.error}
            />
          </div>
          <div className={`${styles.mobileTab} ${styles.paymentPlans}`}>
            {mobileTab === 1 && (
              <Drawer
                className={styles.mobileAddItemDrawer}
                title={null}
                placement="left"
                visible={drawer.visible}
                onClose={this.closeDrawer}
                closable={false}
                getContainer={false}
                width={width + width}
                zIndex={10}
                bodyStyle={{ padding: "0px" }}
                drawerStyle={{ posiiton: "relative" }}
                bodyStyle={{ marginLeft: width }}
              >
                <DrawerPaymentPlans
                  closeDrawer={this.closeDrawer}
                  item={drawer.item}
                  visible={drawer.visible}
                  isSaving={paymentPlans.creating || paymentPlans.updating}
                  isDeleting={paymentPlans.deleting}
                />
              </Drawer>
            )}

            <PaymentPlans
              containerName={styles.paymentPlansSection}
              headerClassName={styles.header}
              bodyClassName={styles.body}
              openDrawer={this.openDrawer}
              data={paymentPlans.data}
              loading={paymentPlans.loading}
              error={paymentPlans.error}
            />
          </div>
          <div className={`${styles.mobileTab} ${styles.dashboard}`}>
            <GridContent>
              <Suspense fallback={<PageLoading />}>
                <AnalysisRow isMobile={true} loading={false} error={false} data={visitData} />
              </Suspense>
              <Suspense fallback={<PageLoading />}>
                <ChartRow isMobile={true} loading={false} error={false} data={visitData} />
              </Suspense>
            </GridContent>
          </div>
        </Tabs>
      );
    } else {
      return (
        <div className={`${styles.layout} ${drawer.visible && styles.drawerOpen}`}>
          <Sider className={`${styles.sider}`} theme={theme}>
            <Loans
              isOpen={loans.isOpen}
              toggleListAccordion={this.toggleListAccordion}
              openDrawer={this.openDrawer}
              data={loans.data}
              loading={loans.loading || paymentPlans.loading}
              error={loans.error}
            />
            <PaymentPlans
              isOpen={paymentPlans.isOpen}
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
              <DrawerLoans
                closeDrawer={this.closeDrawer}
                item={drawer.item}
                visible={drawer.visible}
                isSaving={loans.creating || loans.updating}
                isDeleting={loans.deleting}
              />
            )}
            {drawer.type == "paymentPlans" && (
              <DrawerPaymentPlans
                closeDrawer={this.closeDrawer}
                item={drawer.item}
                visible={drawer.visible}
                isSaving={paymentPlans.creating || paymentPlans.updating}
                isDeleting={paymentPlans.deleting}
              />
            )}
          </Drawer>
          <div className={`${styles.content}`}>
            <GridContent>
              <Suspense fallback={<PageLoading />}>
                <AnalysisRow loading={false} error={false} data={visitData} />
              </Suspense>
              <Suspense fallback={<PageLoading />}>
                <ChartRow loading={false} error={false} data={visitData} />
              </Suspense>
            </GridContent>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
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
