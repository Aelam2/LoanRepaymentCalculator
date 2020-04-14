import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { FormattedMessage } from "react-intl";
import QueueAnim from "rc-queue-anim";
import { Card, Typography } from "antd";
import * as actions from "actions/DashboardActions";
import GridContent from "components/GridContent";
import PageLoading from "components/PageLoading";
import { AnalysisRow, ChartRow } from "pages/DashboardPage/Components";
import { visitData } from "__tests__/mockData/charts";
import styles from "pages/DashboardPage/Components/index.module.scss";
let { Paragraph } = Typography;

class Overview extends React.Component {
  componentDidMount = () => {
    this.props.fetchAmortizationSchedule();
  };

  render() {
    let { isMobile, width, theme, currency, loans, amortization } = this.props;
    let isDark = theme === "dark" ? true : false;
    let { mobileTab } = this.props;

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

    return (
      <GridContent>
        <QueueAnim type="right">
          <AnalysisRow isMobile={isMobile} width={width} loading={false} error={false} data={visitData} currency={currency} />
        </QueueAnim>
        <QueueAnim type="bottom">
          <ChartRow
            refetchData={this.props.fetchAmortizationSchedule}
            currency={currency}
            isMobile={isMobile}
            width={width}
            loading={amortization.loading}
            error={amortization.error}
            data={amortization.data
              .map(l =>
                l.schedule.map(s => {
                  return { ...s, ...l, LoanID: s.LoanID.toString() };
                })
              )
              .flat()}
          />
        </QueueAnim>
      </GridContent>
    );
  }
}

const mapStateToProps = state => {
  return {
    isMobile: state.site.isMobile,
    theme: state.site.theme,
    width: state.site.width,
    currency: state.site.currency,
    mobileTab: state.dashboard.mobileTab,
    drawer: state.dashboard.drawer,
    loans: state.dashboard.loans,
    paymentPlans: state.dashboard.paymentPlans,
    amortization: state.dashboard.analytics.amortization
  };
};

export default compose(connect(mapStateToProps, actions))(Overview);
