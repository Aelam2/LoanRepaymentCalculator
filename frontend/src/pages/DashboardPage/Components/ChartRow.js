import React from "react";
import numeral from "numeral";
import moment from "moment";
import { MiniArea } from "components/Charts";
import { Col, Row, Card, Tooltip } from "antd";
import { FormattedMessage, FormattedDate } from "react-intl";
import styles from "../DashboardPage.module.scss";

const topColResponsiveProps = {
  xs: 24,
  style: { marginBottom: 24 }
};

const ChartRow = ({ isMobile, data, loading, error, ...props }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <Card
        loading={loading}
        bordered={false}
        bodyStyle={{ padding: 0 }}
        title={<FormattedMessage id="dashboard.chart.title" defaultMessage="Current Repayment Outlook" />}
        headStyle={{ padding: "12px" }}
        className={styles.analysisCard}
      >
        <div className={styles.salesCard}>
          <MiniArea height={isMobile ? 250 : 450} data={data} color="#fc5c9c54" borderColor="#fc5c9c" line={true} />
        </div>
      </Card>
    </Col>
  </Row>
);

export default ChartRow;
