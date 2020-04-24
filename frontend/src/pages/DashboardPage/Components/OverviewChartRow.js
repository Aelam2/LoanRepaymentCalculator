import React, { useEffect, useRef } from "react";
import constants from "utils/constants.js";
import moment from "moment";
import { Chart } from "@antv/g2";
import { Col, Row, Card, Result, Button, Switch } from "antd";
import PageLoading from "components/PageLoading";
import { FormattedMessage, useIntl } from "react-intl";
import debounce from "lodash/debounce";
import styles from "../DashboardPage.module.scss";

const topColResponsiveProps = {
  xs: 24,
  style: { marginBottom: 24 }
};

const ChartRow = React.memo(({ isMobile, refetchData, width, currency, data = [], loading, error, currentPlan, ...props }) => {
  const intl = useIntl();
  const chartContainer = React.createRef();
  const chartExtraContainer = React.createRef();

  let cardHeight = isMobile ? 250 : 450;
  let chartHeight = isMobile ? 225 : 450;

  useEffect(() => {
    if (data.length && chartContainer.current) {
      let maxYScale = Math.ceil(Math.max.apply(Math,data.map(d => d.balance)) / 2000) * 2000 //prettier-ignore
      let padding = [isMobile ? 35 : 30, !isMobile ? 20 : 7.5, isMobile ? 40 : 60, isMobile ? 7.5 : maxYScale > 10000 ? 60 : 50];

      const chart = new Chart({
        container: chartContainer.current,
        height: chartHeight,
        width: chartContainer.current.clientWidth,
        padding: padding,
        theme: "light"
      });

      // X-AXIS
      chart.axis("date", {
        label: {
          formatter: val => `${intl.formatDate(moment(val), { month: "short" })}\n${intl.formatDate(moment(val), { year: "numeric" })}`,
          style: { fill: "#fff" },
          offset: 25,
          autoRotate: false,
          autoHide: true
        }
      });

      // Y-AXIS
      chart.axis("balance", {
        label: {
          autoHide: true,
          style: { fill: "#fff", fontWeight: 600 },
          ...(isMobile && { offset: -5 })
        }
      });

      // Axis Scales
      chart.scale({
        balance: {
          min: "0",
          formatter: val => intl.formatNumber(val, { style: "currency", currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }),
          nice: true
        },
        date: {
          formatter: val => `${intl.formatDate(moment(val), { month: "long" })}, ${intl.formatDate(moment(val), { year: "numeric" })}`,
          nice: true,
          ...(isMobile && { tickInterval: 5 }),
          showLast: true
        }
      });

      // DATA LINE
      chart
        .line()
        .position("date*balance")
        .color("LoanName", constants.chart.line.colors)
        .shape("smooth")
        .tooltip("LoanName*balance*amount", (LoanName, balance, amount) => {
          return {
            name: LoanName,
            value: `${intl.formatNumber(balance, { style: "currency", currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            amount: `-(${intl.formatNumber(amount, { style: "currency", currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })})`
          };
        });

      // LEGEND
      chart.legend("LoanName", {
        position: "top",
        offsetY: 0,
        flipPage: true,
        itemName: { style: { fill: "#fff" } }
      });

      // Chart Data
      chart.data(data);

      // CHART POINTS
      if (!isMobile) {
        chart.point().position("date*balance").color("LoanName", constants.chart.point.colors).shape("circle");
      } else {
        chart
          .point()
          .size("date", val => {
            if (moment(val).month() == "0") return 3;
            return 0;
          })
          .position("date*balance")
          .color("LoanName", constants.chart.point.colors)
          .shape("circle");
        chart.legend("date", false);
      }

      // TOOLTIP
      if (!isMobile) {
        chart.tooltip({
          showCrosshairs: true,
          shared: true,
          itemTpl: `
                  <li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;">
                    <span style='background-color:{color};' class='g2-tooltip-marker'></span>
                    <span class='g2-tooltip-name'>{name}</span>
                    <span style='display: inline-block; margin-left: 30px;'>{value}</span>
                    <span class='g2-tooltip-value' style='display: inline-block; float: right; margin-left: 10px; color: red;'>{amount}</span>
                  </li>
                `
        });
      }

      chart.on("tooltip:change", e => {
        setTimeout(() => {
          let date = moment(e.title, "MMM, YYYY");
          props.onChartTooltipHover(date.toISOString());
        }, 5);
      });

      chart.on("tooltip:hide", e => {
        setTimeout(() => {
          props.onChartTooltipHover(null);
        }, 5);
      });

      chart.render();

      return () => chart.destroy();
    }
  }, [data.length || chartContainer.current]);

  return (
    <Row gutter={24} type="flex">
      <Col {...topColResponsiveProps}>
        <Card
          bordered={false}
          bodyStyle={{ padding: 0, height: cardHeight, paddingTop: "15px" }}
          title={
            currentPlan.hasOwnProperty("PlanName") ? (
              `${currentPlan.PlanName} Repayment Outlook`
            ) : (
              <FormattedMessage id="dashboard.chart.title" defaultMessage="Minimum Payment Outlook" />
            )
          }
          headStyle={{ padding: "12px" }}
          className={styles.analysisCard}
          extra={
            <div onClick={() => props.toggleConsolidatedView(!props.isConsolidatedView)}>
              <FormattedMessage id="dashboard.analytics.toggleConsolidatedView" defaultMessage="Consolidated View" />{" "}
              <Switch checked={props.isConsolidatedView} />
            </div>
          }
        >
          <div className={styles.salesCard}>
            {(() => {
              if (loading) {
                return <PageLoading style={{ height: cardHeight }} />;
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
                <div className={styles.miniChart} style={{ height: cardHeight, overflowX: "auto" }}>
                  <div className={styles.chartContent}>
                    {cardHeight > 0 && <div ref={chartContainer}></div>}
                    {cardHeight > 0 && <div ref={chartExtraContainer}></div>}
                  </div>
                </div>
              );
            })()}
          </div>
        </Card>
      </Col>
    </Row>
  );
});

export default ChartRow;
