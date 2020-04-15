import React, { useEffect } from "react";
import constants from "utils/constants.js";
import moment from "moment";
import { Chart } from "@antv/g2";
import { Col, Row, Card, Result, Button } from "antd";
import PageLoading from "components/PageLoading";
import { FormattedMessage, FormattedDate, FormattedNumber, useIntl } from "react-intl";
import styles from "../DashboardPage.module.scss";

const topColResponsiveProps = {
  xs: 24,
  style: { marginBottom: 24 }
};

const ChartRow = ({ isMobile, refetchData, width, currency, data = [], loading, error, ...props }) => {
  const intl = useIntl();
  const chartContainer = React.createRef();
  let height = isMobile ? 325 : 450;

  useEffect(() => {
    if (data.length && chartContainer.current) {
      let chartWidth = isMobile ? [...new Set(data.map(d => d.PaymentDate))].length * 50 : chartContainer.current.clientWidth;
      let maxYScale = Math.ceil(Math.max.apply(Math,data.map(d => d.Balance)) / 2000) * 2000 //prettier-ignore

      const chart = new Chart({
        container: chartContainer.current,
        height: height,
        width: chartWidth,
        padding: [30, 20, 64, maxYScale.toString().length > 4 ? 55 : 45],
        theme: "light"
      });

      chart.tooltip({
        showCrosshairs: true,
        shared: true
      });

      chart.scale({
        Balance: {
          min: "0",
          nice: true,
          formatter: val => intl.formatNumber(val, { style: "currency", currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })
        },
        PaymentDate: {
          formatter: val => `${intl.formatDate(moment(val), { month: "long" })}, ${intl.formatDate(moment(val), { year: "numeric" })}`
        }
      });

      chart.axis("PaymentDate", {
        label: {
          formatter: val => `${intl.formatDate(moment(val), { month: "short" })}\n${intl.formatDate(moment(val), { year: "numeric" })}`,
          style: { fill: "#fff" },
          offset: 25
        }
      });

      chart.axis("Balance", {
        label: {
          autoHide: true,
          style: { fill: "#fff", height: 25 }
        }
      });

      chart.line().position("PaymentDate*Balance*LoanID").color("LoanName", constants.chart.line.colors).shape("smooth");
      chart.point().position("PaymentDate*Balance*LoanID").color("LoanName", constants.chart.point.colors).shape("circle");

      chart.legend({ position: "top", offsetY: 0, itemName: { style: { fill: "#fff" } } });

      chart.tooltip({
        position: "right",
        shared: true,
        offset: 45
      });

      chart.data(data);
      chart.render();

      return () => chart.destroy();
    }
  }, [data]);

  return (
    <Row gutter={24} type="flex">
      <Col {...topColResponsiveProps}>
        <Card
          bordered={false}
          bodyStyle={{ padding: 0, height: height, overflow: "hidden", paddingTop: "15px" }}
          title={<FormattedMessage id="dashboard.chart.title" defaultMessage="Current Repayment Outlook" />}
          headStyle={{ padding: "12px" }}
          className={styles.analysisCard}
        >
          <div className={styles.salesCard}>
            {(() => {
              if (loading) {
                return <PageLoading style={{ height: height }} />;
              }

              if (error) {
                return (
                  <Result
                    status="warning"
                    title="Uhhh Ohh! There was a problem fetching your repayment data"
                    extra={<Button onClick={refetchData}>Reload Chart</Button>}
                  />
                );
              }

              return (
                <div className={styles.miniChart} style={{ height, overflowX: "auto" }}>
                  <div className={styles.chartContent}>{height > 0 && <div ref={chartContainer}></div>}</div>
                </div>
              );
            })()}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ChartRow;
