import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import * as DashActions from "actions/DashboardActions";
import * as ScheduleActions from "actions/PaymentScheduleActions";
import { FormattedNumber, FormattedMessage } from "react-intl";
import QueueAnim from "rc-queue-anim";
import { Table, Card, Select, Spin, Result } from "antd";
import styles from "./PaymentSchedulePage.module.scss";

const { Option } = Select;

class PaymentSchedulePage extends React.Component {
  async componentDidMount() {
    let { schedule, analytics } = this.props;

    if (!analytics.data.masterSchedule.length) {
      this.props.fetchAmortizationSchedule(this.props.loans.data.filter(l => l.hidden).map(l => l.LoanID));
      this.props.handleSchedulePivot(this.props.groupBy, this.props.analytics.data.masterSchedule);
    } else if (!schedule.length) {
      this.props.handleSchedulePivot(this.props.groupBy, this.props.analytics.data.masterSchedule);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.groupBy !== this.props.groupBy ||
      prevProps.schedule.length !== this.props.schedule.length ||
      (prevProps.analytics.loading === true && this.props.analytics.loading === false)
    ) {
      this.props.handleSchedulePivot(this.props.groupBy, this.props.analytics.data.masterSchedule);
    }
  }

  handleGroupByChange = groupBy => {
    this.props.handleGroupByChange(groupBy);
  };

  render() {
    let { groupBy, schedule, loading, error, currency } = this.props;

    let columns = [
      {
        // If grouped by month, show each loan name
        title: groupBy == "month" ? "Loan" : "Date",
        dataIndex: groupBy == "month" ? "LoanName" : "date",
        key: groupBy == "month" ? "LoanName" : "date",
        fixed: "left",
        width: 100,
        render: val => {
          return groupBy == "month" ? val : moment(val).format("MMM DD, YYYY");
        }
      },
      {
        title: "Total Payment",
        dataIndex: "amount",
        key: "amount",
        width: 125,
        render: val => <FormattedNumber value={val} style="currency" currency={currency} minimumFractionDigits={0} maximumFractionDigits={0} />
      },
      {
        title: "Towards Principal",
        dataIndex: "principal",
        key: "principal",
        width: 125,
        render: val => <FormattedNumber value={val} style="currency" currency={currency} minimumFractionDigits={0} maximumFractionDigits={0} />
      },
      {
        title: "Towards Interest",
        dataIndex: "interest",
        key: "interest",
        width: 125,
        render: val => <FormattedNumber value={val} style="currency" currency={currency} minimumFractionDigits={0} maximumFractionDigits={0} />
      },
      {
        title: "Remaining Balance",
        dataIndex: "balance",
        key: "balance",
        width: 125,
        render: val => <FormattedNumber value={val} style="currency" currency={currency} minimumFractionDigits={0} maximumFractionDigits={0} />
      }
    ];

    if (loading) {
      return (
        <div className={styles.layout}>
          <div className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "250px" }}>
            <Spin />
          </div>
        </div>
      );
    }

    if (error) {
      return null;
    }

    if (schedule.length < 3) {
      return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "150px" }}>
          <Result
            status="info"
            title={<FormattedMessage id="dashboard.analytics.notEnoughInfoTitle" defaultMessage="Not Enough Data" />}
            subTitle={
              <FormattedMessage
                id="dashboard.analytics.notEnoughInfoSubTitle"
                defaultMessage="Unable to generate amortization schedule for less than three months worth of payments"
              />
            }
          />
        </div>
      );
    }

    return (
      <div className={styles.layout}>
        <div className={`${styles.groupByHeader} ant-menu ant-menu-horizontal`}>
          <span className={styles.groupByTitle}>Grouped by:</span>
          <Select value={groupBy} onChange={this.handleGroupByChange} bordered={false} className={styles.select}>
            <Option value="month" key="month">
              Month
            </Option>
            <Option value="loan" key="loan">
              Loans
            </Option>
          </Select>
        </div>
        <div className="main-content">
          <QueueAnim delay={150} id="schedule-list">
            {schedule.map(s => {
              return (
                <Card className={styles.scheduleCard} title={s.title}>
                  <Table columns={columns} dataSource={s.payments} pagination={false} size="small" scroll={{ x: 500 }} />
                </Card>
              );
            })}
          </QueueAnim>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currency: state.site.currency,
    paymentPlans: state.dashboard.paymentPlans,
    loans: state.dashboard.loans,
    analytics: state.dashboard.analytics,
    groupBy: state.paymentSchedule.groupBy,
    schedule: state.paymentSchedule.schedule,
    loading: state.paymentSchedule.loading || state.dashboard.analytics.loading,
    error: state.paymentSchedule.error || state.dashboard.analytics.error
  };
};

export default compose(connect(mapStateToProps, { ...DashActions, ...ScheduleActions }))(PaymentSchedulePage);
