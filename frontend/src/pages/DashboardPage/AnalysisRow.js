import React from "react";
import numeral from "numeral";
import moment from "moment";
import { ChartCard, Field, Trend, MiniArea, MiniBar, MiniProgress } from "components/Charts";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Row, Tooltip } from "antd";
import { FormattedMessage, FormattedDate } from "react-intl";
// import {  MiniArea, MiniBar, MiniProgress } from "./Charts";
// import Yuan from '../utils/Yuan';
import styles from "./DashboardPage.module.scss";

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
  style: { marginBottom: 24 }
};

const StatisticsRow = ({ data, loading, error }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={<FormattedMessage id="dashboard.analysis.card.one.title" defaultMessage="Total Sales" />}
        action={
          <Tooltip title={<FormattedMessage id="dashboard.analysis.card.one.tooltip" defaultMessage="Introduce" />}>
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => <FormattedDate value={moment("2021-03-29 18:40:06.2766667 +00:00")} year="numeric" month="long" day="2-digit" />}
        footer={
          <Field
            label={<FormattedMessage id="dashboard.analysis.card.one.footer" defaultMessage="Daily Sales" />}
            value={<FormattedDate value={moment("2022-04-31 18:40:06.2766667 +00:00")} year="numeric" month="long" day="2-digit" />}
          />
        }
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          <FormattedMessage id="BLOCK_NAME.analysis.week" defaultMessage="Weekly Changes" />
          <span className={styles.trendText}>12%</span>
        </Trend>
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={<FormattedMessage id="dashboard.analysis.card.two.title" defaultMessage="Total Sales" />}
        action={
          <Tooltip title={<FormattedMessage id="dashboard.analysis.card.two.tooltip" defaultMessage="Introduce" />}>
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => 126560}
        footer={
          <Field label={<FormattedMessage id="dashboard.analysis.card.two.footer" defaultMessage="Daily Sales" />} value={`$${numeral(12423).format("0,0")}`} />
        }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={data} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
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
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          <FormattedMessage id="BLOCK_NAME.analysis.week" defaultMessage="Weekly Changes" />
          <span className={styles.trendText}>12%</span>
        </Trend>
      </ChartCard>
    </Col>
  </Row>
);

export default StatisticsRow;
