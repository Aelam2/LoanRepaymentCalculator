import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { FormattedMessage } from "react-intl";
import QueueAnim from "rc-queue-anim";
import { Card, Typography } from "antd";
import * as actions from "actions/DashboardActions";
import GridContent from "components/GridContent";
import PageLoading from "components/PageLoading";
import { OverviewAnalysisRow, OverviewChartRow } from "pages/DashboardPage/Components";
import { visitData } from "__tests__/mockData/charts";
import styles from "pages/DashboardPage/Components/index.module.scss";
let { Paragraph } = Typography;

class Overview extends React.Component {
  componentDidMount = () => {
    if (!this.props.analytics.data.masterSchedule.length) {
      this.props.fetchAmortizationSchedule();
    }
  };

  componentDidUpdate() {}

  toggleConsolidatedView = isConsolidated => {
    this.props.toggleConsolidatedView(isConsolidated);
  };

  render() {
    let { isMobile, width, theme, currency, loans, paymentPlans, analytics, ...props } = this.props;

    if (loans.loading) {
      return <PageLoading style={{ height: isMobile ? "50%" : "300px" }} />;
    }

    if (!loans.data.length) {
      return (
        <Card
          className={styles.overviewEmptyCard}
          title={
            <div className={styles.title}>
              <FormattedMessage id="dashboard.overview.empty.title" defaultMessage="Getting Started!" tagName="h3" />
            </div>
          }
        >
          <div className={styles.bodyWrapper}>
            <div className={styles.paragraph}>
              <FormattedMessage id="dashboard.overview.empty.paragraphOne" defaultMessage="" tagName="p" />
            </div>
            <hr style={{ margin: "17px 0px" }} />
            <div className={styles.paragraph}>
              <FormattedMessage id="dashboard.overview.empty.paragraphTwo" defaultMessage="" tagName="p" />
            </div>
          </div>
        </Card>
      );
    }

    let scheduleView = analytics.isConsolidatedView
      ? analytics.data.consolidatedSchedule.map(s => {
          return { ...s, date: moment(s.date).startOf("month").endOf("day").toISOString(), LoanID: s.LoanID.toString() };
        })
      : analytics.data.masterSchedule.map(s => {
          return { ...s, date: moment(s.date).startOf("month").endOf("day").toISOString(), LoanID: s.LoanID.toString() };
        });

    return (
      <GridContent>
        <QueueAnim type="right">
          <OverviewAnalysisRow
            isMobile={isMobile}
            width={width}
            currency={currency}
            loading={analytics.loading || loans.loading || paymentPlans.loading}
            error={analytics.error || loans.error || paymentPlans.error}
            data={analytics.data}
            selectedMonth={analytics.data.selectedMonth}
            selectedMinimumMonth={analytics.data.selectedMinimumMonth}
            currentPlan={paymentPlans.currentPlan}
          />
        </QueueAnim>
        <QueueAnim type="bottom">
          <OverviewChartRow
            refetchData={this.props.fetchAmortizationSchedule}
            isConsolidatedView={analytics.isConsolidatedView}
            toggleConsolidatedView={this.toggleConsolidatedView}
            onChartTooltipHover={this.props.onChartTooltipHover}
            currency={currency}
            isMobile={isMobile}
            width={width}
            loading={analytics.loading || loans.loading || paymentPlans.loading}
            error={analytics.error || loans.error || paymentPlans.error}
            data={scheduleView}
            currentPlan={paymentPlans.currentPlan}
          />
        </QueueAnim>
      </GridContent>
    );
  }
}

const mapStateToProps = state => {
  return {
    isMobile: state.site.isMobile,
    width: state.site.width,
    currency: state.site.currency,
    loans: state.dashboard.loans,
    paymentPlans: state.dashboard.paymentPlans,
    analytics: state.dashboard.analytics
  };
};

export default compose(connect(mapStateToProps, actions))(Overview);
