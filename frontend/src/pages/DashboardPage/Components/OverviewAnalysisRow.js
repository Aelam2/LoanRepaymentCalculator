import React from "react";
import numeral from "numeral";
import moment from "moment";
import QueueAnim from "rc-queue-anim";
import { ChartCard, Field, Trend, MiniArea } from "components/Charts";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Row, Tooltip } from "antd";
import { FormattedMessage, FormattedDate } from "react-intl";
import TweenOne from "rc-tween-one";
import Children from "rc-tween-one/lib/plugin/ChildrenPlugin";
import styles from "./index.module.scss";

TweenOne.plugins.push(Children);

const StatisticsRow = ({ isMobile, width, data, loading, error, ...props }) => {
  const topColResponsiveProps = {
    ...(!isMobile && { xs: 24 }),
    ...(!isMobile && { sm: 24 }),
    ...(!isMobile && { md: 24 }),
    ...(!isMobile && { lg: 12 }),
    ...(!isMobile && { xl: 8 }),
    style: { marginBottom: 24 }
  };

  return (
    <Row gutter={24} type="flex" className={`${isMobile ? styles.horizontalScroll : ""}`}>
      <Col {...topColResponsiveProps} className={styles.col}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="dashboard.analysis.card.one.title" defaultMessage="Total Sales" />}
          action={
            <Tooltip title={<FormattedMessage id="dashboard.analysis.card.one.tooltip" defaultMessage="Introduce" />}>
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => <FormattedDate value={data.finalPayment} year="numeric" month="long" day="2-digit" />}
          footer={
            <Field
              label={<FormattedMessage id="dashboard.analysis.card.one.footer" defaultMessage="Daily Sales" />}
              value={<FormattedDate value={moment("2022-04-31 18:40:06.2766667 +00:00")} year="numeric" month="long" day="2-digit" />}
            />
          }
          contentHeight={46}
          className={`${styles.analysisCard} ${styles.topRowCard}`}
        >
          <Trend flag="up" style={{ marginRight: 16 }}>
            <FormattedMessage id="BLOCK_NAME.analysis.week" defaultMessage="Weekly Changes" />
            <span className={styles.trendText}>12%</span>
          </Trend>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps} className={styles.col}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="dashboard.analysis.card.two.title" defaultMessage="Total Sales" />}
          action={
            <Tooltip title={<FormattedMessage id="dashboard.analysis.card.two.tooltip" defaultMessage="Introduce" />}>
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => (
            <TweenOne
              animation={{
                Children: {
                  value: data.principal || 0,
                  floatLength: 2,
                  formatMoney: true
                },
                duration: 1250
              }}
            >
              0
            </TweenOne>
          )}
          footer={
            <Field
              label={<FormattedMessage id="dashboard.analysis.card.two.footer" defaultMessage="Daily Sales" />}
              value={`$${numeral(12423).format("0,0")}`}
            />
          }
          contentHeight={46}
          className={`${styles.analysisCard} ${styles.topRowCard}`}
        >
          <MiniArea
            color="#fc5c9c"
            data={data.consolidated.map(s => {
              return { ...s, x: moment(s.date).format("MMM YYYY"), y: Number(s.balance.toFixed(2)) };
            })}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps} lg={24} className={styles.col}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="dashboard.analysis.card.three.title" defaultMessage="Total Sales" />}
          action={
            <Tooltip title={<FormattedMessage id="dashboard.analysis.card.three.tooltip" defaultMessage="Introduce" />}>
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => <FormattedDate value={moment("2021-03-29 18:40:06.2766667 +00:00")} year="numeric" month="long" day="2-digit" />}
          footer={
            <Field
              label={<FormattedMessage id="dashboard.analysis.card.three.footer" defaultMessage="Daily Sales" />}
              value={<FormattedDate value={moment("2022-04-31 18:40:06.2766667 +00:00")} year="numeric" month="long" day="2-digit" />}
            />
          }
          contentHeight={46}
          className={`${styles.analysisCard} ${styles.topRowCard}`}
        >
          <Trend flag="up" style={{ marginRight: 16 }}>
            <FormattedMessage id="BLOCK_NAME.analysis.week" defaultMessage="Weekly Changes" />
            <span className={styles.trendText}>12%</span>
          </Trend>
        </ChartCard>
      </Col>
    </Row>
  );
};

export default StatisticsRow;
