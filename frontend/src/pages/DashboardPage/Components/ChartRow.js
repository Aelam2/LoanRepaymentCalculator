import React from "react";
import numeral from "numeral";
import moment from "moment";
import { LineChart } from "components/Charts";
import { Col, Row, Card, Result, Button } from "antd";
import PageLoading from "components/PageLoading";
import { FormattedMessage, FormattedDate } from "react-intl";
import styles from "../DashboardPage.module.scss";

const topColResponsiveProps = {
  xs: 24,
  style: { marginBottom: 24 }
};

const ChartRow = ({ isMobile, refetchData, width, data, loading, error, ...props }) => {
  let chartHeight = isMobile ? width * 0.45 : 450;

  return (
    <Row gutter={24} type="flex">
      <Col {...topColResponsiveProps}>
        <Card
          bordered={false}
          bodyStyle={{ padding: 0, height: chartHeight }}
          title={<FormattedMessage id="dashboard.chart.title" defaultMessage="Current Repayment Outlook" />}
          headStyle={{ padding: "12px" }}
          className={styles.analysisCard}
        >
          <div className={styles.salesCard}>
            {(() => {
              if (loading) {
                return <PageLoading style={{ height: chartHeight }} />;
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

              return <LineChart height={chartHeight} data={data} color="#fc5c9c54" borderColor="#fc5c9c" line={true} />;
            })()}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ChartRow;
