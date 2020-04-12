import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { FormattedMessage, FormattedNumber } from "react-intl";
import QueueAnim from "rc-queue-anim";
import SimpleBar from "simplebar-react";

import { Button, List, Spin, Result, Typography, Empty } from "antd";
import { EditFilled, RightOutlined, ScheduleOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const { Paragraph, Text, Title } = Typography;

class PaymentPlans extends React.Component {
  state = {
    isOpen: true
  };

  render() {
    let { openDrawer, currency, data, loading, error } = this.props;
    let { containerName, headerClassName, bodyClassName } = this.props;
    let { isOpen, toggleListAccordion, isMobile, loansExist } = this.props;

    return (
      <div className={`${styles.viewSection} ${containerName}`}>
        <div className={`${styles.header} ${headerClassName}`}>
          <h3 className={styles.title} onClick={() => !isMobile && toggleListAccordion("paymentPlans", !isOpen)}>
            {!isMobile && <RightOutlined className={`${styles.chevron} ${isOpen ? styles.chevronOpen : styles.chevronClosed}`} />}
            <FormattedMessage id="dashboard.accordion.paymentPlans.title" defaultMessage="My Plans" />
          </h3>
          <Button type="primary" className={styles.btn} onClick={() => openDrawer("paymentPlans", null)}>
            <Paragraph ellipsis type="white">
              <FormattedMessage id="dashboard.accordion.paymentPlans.add.button" defaultMessage="+ Add Plan" />
            </Paragraph>
          </Button>
        </div>
        <div className={`${styles.body} ${bodyClassName} ${isMobile || isOpen ? styles.bodyOpen : styles.bodyClosed}`}>
          <SimpleBar className={styles.list}>
            {(() => {
              if (error) {
                return <Result status="warning" title="Error loading loans" />;
              }

              if (loading) {
                return (
                  <div
                    style={{
                      height: "calc(49vh - 130px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      visibility: isMobile || isOpen ? "visible" : "hidden"
                    }}
                  >
                    <Spin />
                  </div>
                );
              }

              if (data && data.length) {
                return (
                  <QueueAnim delay={150} id="loans-list">
                    {data.map(loan => {
                      return (
                        <List.Item
                          key={loan.LoanID}
                          className={styles.listItemContainer}
                          actions={[
                            <Text key="edit" type="secondary" onClick={() => openDrawer("loans", loan)}>
                              <FormattedMessage id="dashboard.accordion.paymentPlans.edit.button" defaultMessage="Edit" />
                              <EditFilled style={{ marginLeft: "5px" }} />
                            </Text>
                          ]}
                        >
                          <div className={styles.listItemContent}>
                            <Title ellipsis className={styles.listItemTitle} level={4}>
                              {loan.LoanName}
                            </Title>
                            <Text>
                              <FormattedNumber
                                value={loan.LoanBalance}
                                style="currency"
                                currency={currency}
                                minimumFractionDigits={0}
                                maximumFractionDigits={0}
                              />{" "}
                              /{" "}
                              <FormattedNumber
                                value={loan.PaymentMinimum}
                                style="currency"
                                currency={currency}
                                minimumFractionDigits={0}
                                maximumFractionDigits={0}
                              />{" "}
                              / <FormattedNumber value={loan.InterestRate} style="percent" minimumFractionDigits={2} />
                            </Text>
                          </div>
                        </List.Item>
                      );
                    })}
                  </QueueAnim>
                );
              }

              // If no errors or loans found, display empty message
              return (
                <Empty
                  style={{ marginTop: "25px" }}
                  image={<ScheduleOutlined style={{ fontSize: "72px", height: "100%", display: "flex", alignItems: "flex-end" }} />}
                  imageStyle={{ height: "75px" }}
                  description={
                    <span style={{ fontWeight: "500", fontSize: "18px" }}>
                      <FormattedMessage id="dashboard.accordion.paymentPlans.empty" defaultMessage="No payment plans found" />
                    </span>
                  }
                />
              );
            })()}
          </SimpleBar>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isMobile: state.site.isMobile,
    currency: state.site.currency,
    theme: state.site.theme
  };
};

export default compose(connect(mapStateToProps, null))(PaymentPlans);
