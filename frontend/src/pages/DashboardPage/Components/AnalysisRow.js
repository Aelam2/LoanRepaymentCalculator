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

import styles from "../DashboardPage.module.scss";

TweenOne.plugins.push(Children);

const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 8,
  style: { marginBottom: 24 }
};

const StatisticsRow = ({ isMobile, width, data, loading, error, ...props }) => {
  if (isMobile) {
    return (
      <div className={`${isMobile ? styles.horizontalScroll : ""}`}>
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
          className={styles.analysisCard}
        >
          <Trend flag="up" style={{ marginRight: 16 }}>
            <FormattedMessage id="BLOCK_NAME.analysis.week" defaultMessage="Weekly Changes" />
            <span className={styles.trendText}>12%</span>
          </Trend>
        </ChartCard>
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
                  value: 24500,
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
          className={styles.analysisCard}
        >
          <MiniArea color="#fc5c9c" data={data} />
        </ChartCard>
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
          className={styles.analysisCard}
        >
          <Trend flag="up" style={{ marginRight: 16 }}>
            <FormattedMessage id="BLOCK_NAME.analysis.week" defaultMessage="Weekly Changes" />
            <span className={styles.trendText}>12%</span>
          </Trend>
        </ChartCard>
      </div>
    );
  } else {
    return (
      <Row gutter={24} type="flex">
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
            total={() => <FormattedDate value={moment("2021-03-29 18:40:06.2766667 +00:00")} year="numeric" month="long" day="2-digit" />}
            footer={
              <Field
                label={<FormattedMessage id="dashboard.analysis.card.one.footer" defaultMessage="Daily Sales" />}
                value={<FormattedDate value={moment("2022-04-31 18:40:06.2766667 +00:00")} year="numeric" month="long" day="2-digit" />}
              />
            }
            contentHeight={46}
            className={styles.analysisCard}
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
                    value: 24500,
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
            className={styles.analysisCard}
          >
            <MiniArea color="#fc5c9c" data={data} />
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
            className={styles.analysisCard}
          >
            <Trend flag="up" style={{ marginRight: 16 }}>
              <FormattedMessage id="BLOCK_NAME.analysis.week" defaultMessage="Weekly Changes" />
              <span className={styles.trendText}>12%</span>
            </Trend>
          </ChartCard>
        </Col>
      </Row>
    );
  }
};

export default StatisticsRow;
