import React from "react";
import numeral from "numeral";
import moment from "moment";
import { Bar } from "components/Charts";
import { Col, Row, Card, Tooltip } from "antd";
import { FormattedMessage, FormattedDate } from "react-intl";
import styles from "../DashboardPage.module.scss";

const topColResponsiveProps = {
  xs: 24,
  style: { marginBottom: 24 }
};

const ChartRow = ({ data, loading, error }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
        <div className={styles.salesCard}>
          <Bar height={500} title={<FormattedMessage id="BLOCK_NAME.analysis.sales-trend" defaultMessage="Sales Trend" />} data={data} />
        </div>
      </Card>
    </Col>
  </Row>
);

export default ChartRow;
