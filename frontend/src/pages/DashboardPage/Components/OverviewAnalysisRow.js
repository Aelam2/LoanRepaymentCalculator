import React from "react";
import moment from "moment";
import { ChartCard, Field, Trend, MiniArea } from "components/Charts";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Row, Tooltip } from "antd";
import { FormattedMessage, FormattedDate, FormattedNumber } from "react-intl";
import TextFit from "react-textfit";
import TweenOne from "rc-tween-one";
import Children from "rc-tween-one/lib/plugin/ChildrenPlugin";
import styles from "./index.module.scss";

TweenOne.plugins.push(Children);

const calcDifferencePercent = (before, after) => {
  let percent = (Number(after) / Number(before)) * 100;
  return Number(100 - percent).toFixed(2);
};

const StatisticsRow = ({ isMobile, width, data, loading, error, currency, selectedMonth, selectedMinimumMonth, ...props }) => {
  const topColResponsiveProps = {
    ...(!isMobile && { xs: 24 }),
    ...(!isMobile && { sm: 24 }),
    ...(!isMobile && { md: 24 }),
    ...(!isMobile && { lg: 12 }),
    ...(!isMobile && { xl: 8 }),
    style: { marginBottom: 24 }
  };

  let minimumPlan = data.minimumPlan || {};
  let currentPlan = data || {};

  let monthDifferencePercent = calcDifferencePercent(minimumPlan.payments, currentPlan.payments);
  let monthDifferenceNum = minimumPlan.payments - currentPlan.payments;
  let daysLeft = moment(currentPlan.finalPayment).diff(moment(), "days");

  return (
    <Row gutter={24} type="flex" className={`${isMobile ? styles.horizontalScroll : ""}`}>
      <Col {...topColResponsiveProps} className={styles.col}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="dashboard.analysis.card.one.title" defaultMessage="Payoff Date" />}
          action={
            <Tooltip title={<FormattedMessage id="dashboard.analysis.card.one.tooltip" defaultMessage="Date that loans will be 100% paid off" />}>
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => (
            <TextFit>
              <FormattedDate value={data.finalPayment} year="numeric" month="long" day="2-digit" />
            </TextFit>
          )}
          footer={
            <Field
              label={<FormattedMessage id="dashboard.analysis.card.one.footer" defaultMessage="No Plan: " />}
              value={<FormattedDate value={moment(minimumPlan.finalPayment)} year="numeric" month="long" day="2-digit" />}
            />
          }
          contentHeight={46}
          className={`${styles.analysisCard} ${styles.topRowCard}`}
        >
          {monthDifferenceNum ? (
            <Trend flag="up" reverseColor={true}>
              <span className={styles.trendText}>
                {daysLeft} <FormattedMessage id="dashboard.analysis.card.one.daysLeft" defaultMessage="days left" />
              </span>
              <span className={styles.trendText} style={{ marginLeft: "12px", paddingLeft: "12px", borderLeft: "solid 1px #E0DAC5" }}>
                {monthDifferenceNum} <FormattedMessage id="dashboard.analysis.card.one.monthsFaster" defaultMessage="months faster" />
              </span>
              <span className={styles.trendText} style={{ marginLeft: "12px", paddingLeft: "12px", borderLeft: "solid 1px #E0DAC5" }}>
                {monthDifferencePercent} <FormattedMessage id="dashboard.analysis.card.one.percentQuicker" defaultMessage="% quicker" />
              </span>
            </Trend>
          ) : (
            <span className={styles.trendText}>
              {daysLeft} <FormattedMessage id="dashboard.analysis.card.one.daysLeft" defaultMessage="days left" />
            </span>
          )}
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps} className={styles.col}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="dashboard.analysis.card.two.title" defaultMessage="Total Balance" />}
          action={
            <Tooltip title={<FormattedMessage id="dashboard.analysis.card.two.tooltip" defaultMessage="Total Balance = Principal + Accrued Interest" />}>
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => (
            <TweenOne
              component="span"
              animation={{
                Children: {
                  value: selectedMonth.amount || data.total || 0,
                  floatLength: 2,
                  formatMoney: true
                },
                duration: isMobile ? 0 : selectedMonth.amount ? 250 : 750
              }}
            >
              0
            </TweenOne>
          )}
          footer={
            <Field
              label={<FormattedMessage id="dashboard.analysis.card.two.footer" defaultMessage="No Plan: " />}
              value={
                <TweenOne
                  component="span"
                  animation={{
                    Children: {
                      value: selectedMinimumMonth.amount || minimumPlan.total || 0,
                      floatLength: 2,
                      formatMoney: true
                    },
                    duration: isMobile ? 0 : selectedMonth.interest ? 250 : 750
                  }}
                >
                  0
                </TweenOne>
              }
            />
          }
          contentHeight={46}
          className={`${styles.analysisCard} ${styles.topRowCard}`}
        >
          <MiniArea
            color="#fc5c9c"
            data={data.accumulatedSchedule.map(s => {
              return { ...s, x: moment(s.date).format("MMM YYYY"), y: Number(s.amount.toFixed(2)) };
            })}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps} lg={24} className={styles.col}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="dashboard.analysis.card.three.title" defaultMessage="Principal" />}
          action={
            <Tooltip title={<FormattedMessage id="dashboard.analysis.card.three.tooltip" defaultMessage="Principal amount that is currently owed" />}>
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => (
            <div>
              <TweenOne
                component="span"
                animation={{
                  Children: {
                    value: selectedMonth.principal || currentPlan.principal || 0,
                    floatLength: 2,
                    formatMoney: true
                  },
                  duration: isMobile ? 0 : selectedMonth.principal ? 250 : 750
                }}
              >
                0
              </TweenOne>

              <Field
                className={styles.totalSmall}
                label={<FormattedMessage id="dashboard.analysis.card.three.footer" defaultMessage="No Plan: " />}
                value={
                  <TweenOne
                    component="span"
                    animation={{
                      Children: {
                        value: selectedMinimumMonth.principal || minimumPlan.principal || 0,
                        floatLength: 2,
                        formatMoney: true
                      },
                      duration: isMobile ? 0 : selectedMonth.interest ? 250 : 750
                    }}
                  >
                    0
                  </TweenOne>
                }
              />
            </div>
          )}
          contentHeight={0}
          className={`${styles.analysisCard} ${styles.topRowCard} ${styles.splitColumn}`}
        ></ChartCard>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="dashboard.analysis.card.four.title" defaultMessage="Accured Intrest" />}
          action={
            <Tooltip title={<FormattedMessage id="dashboard.analysis.card.four.tooltip" defaultMessage="Total interest accrued over the life of the loan" />}>
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => (
            <div>
              <TweenOne
                component="span"
                animation={{
                  Children: {
                    value: selectedMonth.interest || currentPlan.interest || 0,
                    floatLength: 2,
                    formatMoney: true
                  },
                  duration: isMobile ? 0 : selectedMonth.interest ? 250 : 750
                }}
              >
                0
              </TweenOne>
              <Field
                className={styles.totalSmall}
                label={<FormattedMessage id="dashboard.analysis.card.four.footer" defaultMessage="No Plan: " />}
                value={
                  <TweenOne
                    component="span"
                    animation={{
                      Children: {
                        value: selectedMinimumMonth.interest || minimumPlan.interest || 0,
                        floatLength: 2,
                        formatMoney: true
                      },
                      duration: isMobile ? 0 : selectedMonth.interest ? 250 : 750
                    }}
                  >
                    0
                  </TweenOne>
                }
              />
            </div>
          )}
          contentHeight={0}
          className={`${styles.analysisCard} ${styles.topRowCard} ${styles.splitColumn}`}
        ></ChartCard>
      </Col>
    </Row>
  );
};

export default StatisticsRow;
