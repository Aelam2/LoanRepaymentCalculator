import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import * as DashActions from "actions/DashboardActions";
import * as ScheduleActions from "actions/PaymentScheduleActions";
import QueueAnim from "rc-queue-anim";
import { Table, Card, Select } from "antd";
import styles from "./PaymentSchedulePage.module.scss";

const { Option } = Select;

class PaymentSchedulePage extends React.Component {
  async componentDidMount() {
    let { schedule, analytics } = this.props;

    if (!analytics.data.masterSchedule.length) {
      this.props.fetchAmortizationSchedule();
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
    let { groupBy, schedule, loading, error } = this.props;

    let columns = [
      {
        // If grouped by month, show each loan name
        title: groupBy == "month" ? "Loan" : "Date",
        dataIndex: groupBy == "month" ? "LoanName" : "date",
        key: groupBy == "month" ? "LoanName" : "date",
        render: val => {
          return groupBy == "month" ? val : moment(val).format("MMM DD, YYYY");
        }
      },
      {
        title: "Total Payment",
        dataIndex: "amount",
        key: "amount",
        render: val => {
          return Number(val).toFixed(2);
        }
      },
      {
        title: "Towards Principal",
        dataIndex: "principal",
        key: "principal",
        render: val => {
          return Number(val).toFixed(2);
        }
      },
      {
        title: "Towards Interest",
        dataIndex: "interest",
        key: "interest",
        render: val => {
          return Number(val).toFixed(2);
        }
      },
      {
        title: "Remaining Balance",
        dataIndex: "balance",
        key: "balance",
        render: val => {
          return Number(val).toFixed(2);
        }
      }
    ];

    if (loading) {
      return (
        <div className={styles.layout}>
          <div className={styles.groupByHeader}>
            <span className={styles.groupByTitle}>Grouped by:</span>
            <Select
              value={groupBy}
              onChange={this.handleGroupByChange}
              disabled={true}
              bordered={false}
              className={`${styles.select} ${styles.selectDisabled}`}
            >
              <Option value="month" key="month">
                Month
              </Option>
              <Option value="loan" key="loan">
                Loans
              </Option>
            </Select>
          </div>
          <div className="main-content">
            <Card>
              <Table loading={loading} columns={columns} />
            </Card>
          </div>
        </div>
      );
    }

    if (error) {
    }

    return (
      <div className={styles.layout}>
        <div className={styles.groupByHeader}>
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
                  <Table columns={columns} dataSource={s.payments} pagination={false} size="small" />
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
    paymentPlans: state.dashboard.paymentPlans,
    analytics: state.dashboard.analytics,
    groupBy: state.paymentSchedule.groupBy,
    schedule: state.paymentSchedule.schedule,
    loading: state.paymentSchedule.loading || state.dashboard.analytics.loading,
    error: state.paymentSchedule.error || state.dashboard.analytics.error
  };
};

export default compose(connect(mapStateToProps, { ...DashActions, ...ScheduleActions }))(PaymentSchedulePage);
