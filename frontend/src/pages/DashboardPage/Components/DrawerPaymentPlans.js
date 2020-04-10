import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/DashboardActions";
import moment from "moment";

import { isEmptyObject } from "utils/utils";

import { FormattedMessage, FormattedNumber } from "react-intl";
import { Button, Form, Input, InputNumber, DatePicker, Select, notification, Typography, Tooltip } from "antd";
import { DoubleLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const { Option } = Select;
const { Paragraph, Text, Title } = Typography;

const formMap = {
  PlanName: {
    form: {
      id: "PlanName",
      name: "PlanName",
      label: <FormattedMessage id="dashboard.drawer.paymentPlans.form.planName" defaultMessage="Payment Plan Name" />,
      rules: [{ required: true, message: "Plan name is required!", whitespace: true }]
    },
    input: {
      size: "large"
    }
  },
  AllocationMethodID: {
    form: {
      id: "AllocationMethodID",
      name: "AllocationMethodID",
      label: <FormattedMessage id="dashboard.drawer.paymentPlans.form.allocationMethodID" defaultMessage="Allocation Method" />,
      rules: [
        { required: true, type: "number", whitespace: true, message: "Balance must be a positive number" },
        { min: 1, type: "number", message: "Must be greater than 0" }
      ]
    },
    input: {
      size: "large"
    }
  },

  PaymentAmount: {
    form: {
      id: "PaymentAmount",
      name: "PaymentAmount",
      label: <FormattedMessage id="dashboard.drawer.paymentPlans.form.paymentAmount" defaultMessage="Payment Amount" />,
      rules: [
        { required: true, type: "number", whitespace: true, message: "Min. payment is required" },
        { min: 0, type: "number", message: "Must be greater than 0" }
      ]
    },
    input: {
      size: "large",
      defaultValue: 0,
      min: 1,
      step: 100,
      formatter: value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      parser: value => value.replace(/\$\s?|(,*)/g, ""),
      style: { width: "100%" }
    }
  },

  PaymentDate: {
    form: {
      id: "PaymentDate",
      name: "PaymentDate",
      label: <FormattedMessage id="dashboard.drawer.paymentPlans.form.paymentDate" defaultMessage="Start Date" />,
      rules: [
        { required: true, type: "number", whitespace: true, message: "Balance must be a positive number" },
        { min: 1, type: "number", message: "Must be greater than 0" }
      ]
    },
    input: {
      size: "large",
      disabledDate: current => current && current <= moment().endOf("day")
    }
  },

  RecurringTypeID: {
    form: {
      id: "AllocationMethodID",
      name: "AllocationMethodID",
      label: <FormattedMessage id="dashboard.drawer.paymentPlans.form.recurringTypeID" defaultMessage="Repeat?" />,
      rules: [
        { required: true, type: "number", whitespace: true, message: "Balance must be a positive number" },
        { min: 1, type: "number", message: "Must be greater than 0" }
      ]
    },
    input: {
      size: "large"
    }
  }
};

class DrawerPaymentPlans extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExisting: false
    };

    this.formRef = React.createRef();
  }

  componentDidMount = async () => {
    await this.checkIsExisitingItem();
    await this.setFieldWithItem();
  };

  componentDidUpdate = async prevProps => {
    if (prevProps.visible !== this.props.visible || JSON.stringify(prevProps.item) !== JSON.stringify(this.props.item)) {
      await this.checkIsExisitingItem();
      await this.setFieldWithItem();
    }
  };

  // Check if drawer is opened with existing item
  checkIsExisitingItem = async () => {
    let { item } = this.props;

    this.setState(
      {
        isExisting: !isEmptyObject(item) ? true : false
      },
      () => {
        return this.state.isExisting;
      }
    );
  };

  setFieldWithItem = async () => {
    let { item } = this.props;
    let { isExisting } = this.state;

    if (this.formRef.current) {
      this.formRef.current.setFieldsValue({
        PlanName: isExisting ? item.PlanName : null,
        AllocationMethodID: isExisting ? item.AllocationMethodID : null,
        InterestRate: isExisting ? item.InterestRate * 100 : null,
        PaymentMinimum: isExisting ? item.PaymentMinimum : null,
        PaymentStart: isExisting ? moment(item.PaymentStart) : null,
        StatusID: isExisting ? item.StatusID : null
      });
    }
  };

  onFinish = async values => {
    try {
      let { item } = this.props;
      let { isExisting } = this.state;

      // convert back to decimal value
      values.InterestRate = values.InterestRate / 100;

      if (isExisting) {
        await this.props.updatePaymentPlan({ LoanID: item.LoanID, ...values });
      } else {
        await this.props.createPaymentPlan(values);
      }

      await this.props.toggleAddEditDrawer(false, null);
    } catch (err) {
      let errMessage = this.state.isExisting ? "There was a problem uppdating the selected Payment Plan." : "An unexpected error occured during plan creation";
      notification.error({ duration: 3000, message: errMessage });
    }
  };

  onDelete = async LoanID => {
    try {
      await this.props.deletePaymentPlan(LoanID);

      await this.props.toggleAddEditDrawer(false, null);
    } catch (err) {
      let errMessage = "Payment Plan was unable to be deleted";
      notification.error({ duration: 3000, message: errMessage });
    }
  };

  renderHeader = () => {
    let { closeDrawer, item, isSaving, isDeleting } = this.props;
    let { isExisting } = this.state;

    if (isExisting || item) {
      return (
        <div className={styles.header}>
          <h3 className={styles.title}>
            <Button onClick={closeDrawer}>
              <DoubleLeftOutlined />
            </Button>
          </h3>
          <div className={styles.actions}>
            <Button
              type="primary"
              className={`${styles.btnSmall} ${isSaving && styles.btnLoading}`}
              form="newLoan"
              htmlType="submit"
              loading={isSaving}
              disabled={isDeleting}
            >
              <FormattedMessage id="dashboard.drawer.header.save" defaultMessage="Save" />
            </Button>
            <Button
              type="danger"
              className={`${styles.btnSmall} ${isSaving && styles.btnLoading}`}
              onClick={() => this.onDelete(item.LoanID)}
              loading={isDeleting}
              disabled={isSaving}
            >
              <FormattedMessage id="dashboard.drawer.header.delete" defaultMessage="Delete" />
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.header}>
          <h3 className={styles.title}>
            <Button onClick={closeDrawer}>
              <DoubleLeftOutlined />
            </Button>
          </h3>
          <div className={styles.actions}>
            <Button type="primary" className={`${styles.btnSmall} ${isSaving && styles.btnLoading}`} form="newLoan" htmlType="submit" loading={isSaving}>
              <FormattedMessage id="dashboard.drawer.header.save" defaultMessage="Save" />
            </Button>
          </div>
        </div>
      );
    }
  };

  render() {
    let { visible, item } = this.props;
    let { isExisting } = this.state;

    if (!visible) {
      return null;
    }

    return (
      <div className={styles.editSection}>
        {this.renderHeader()}

        <Form name="newLoan" className={styles.formContainer} ref={this.formRef} layout="vertical" onFinish={this.onFinish}>
          <Form.Item {...formMap.PlanName.form}>
            <Input {...formMap.PlanName.input} />
          </Form.Item>

          <Form.Item {...formMap.AllocationMethodID.form}>
            <Select defaultValue="Avalanche">
              <Option value="5">
                <FormattedMessage id="dashboard.drawer.paymentPlans.allocation.avalanche" defaultMessage="Avalanche - Highest Interest First" />
              </Option>
              <Option value="4">
                <FormattedMessage id="dashboard.drawer.paymentPlans.allocation.snowball" defaultMessage="Snowball - Lowest Balance First" />
              </Option>
            </Select>
          </Form.Item>

          <Form.List name="payments">
            {(fields, { add, remove }) => (
              <div className={`${styles.paymentsListContainer}`} style={{ border: "#3E587B solid 1px" }}>
                <div
                  className={`${styles.paymentsListHeader}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}
                >
                  <Title level={3}>
                    <FormattedMessage id="dashboard.drawer.paymentPlans.addPaymentTitle" defaultMessage="Payments" />
                    <Tooltip
                      title={
                        <FormattedMessage
                          id="dashboard.drawer.paymentPlans.addPaymentTooltip"
                          defaultMessage="These payments will be made on top of the minimum payments on your loans"
                        />
                      }
                    >
                      <InfoCircleOutlined style={{ marginLeft: "8px", fontSize: "14px" }} />
                    </Tooltip>
                  </Title>
                  <Button
                    onClick={() => {
                      add();
                    }}
                  >
                    <FormattedMessage id="dashboard.drawer.paymentPlans.addPaymentBtn" defaultMessage="Add Payment" />
                  </Button>
                </div>
                <div className={`${styles.paymentsListItemContainer}`}>
                  {fields.map((field, index) => (
                    <Form.Item key={field.key} className={`${styles.paymentsListItem}`}>
                      <Form.Item
                        name={[field.name, formMap.PaymentAmount.form.name]}
                        fieldKey={[field.fieldKey, formMap.PaymentAmount.id]}
                        {...field}
                        {...formMap.PaymentAmount.form}
                      >
                        <Input {...formMap.PaymentAmount.input} />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, formMap.PaymentDate.form.name]}
                        fieldKey={[field.fieldKey, formMap.PaymentDate.id]}
                        {...formMap.PaymentDate.form}
                      >
                        <DatePicker {...formMap.PaymentDate.input} />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, formMap.RecurringTypeID.form.name]}
                        fieldKey={[field.fieldKey, formMap.RecurringTypeID.id]}
                        {...formMap.RecurringTypeID.form}
                      >
                        <Select {...formMap.RecurringTypeID.input}></Select>
                      </Form.Item>
                    </Form.Item>
                  ))}
                </div>
              </div>
            )}
          </Form.List>

          {(() => {
            if (isExisting) {
              if (item.Payments && item.Payments.length) {
                return item.Payments.map(p => (
                  <Form.List>
                    <Form.Item {...formMap.PaymentAmount.form}>
                      <Input {...formMap.PaymentAmount.input} />
                    </Form.Item>
                    <Form.Item {...formMap.PaymentDate.form}>
                      <DatePicker {...formMap.PaymentDate.input} />
                    </Form.Item>
                    <Form.Item {...formMap.RecurringTypeID.form}>
                      <Select {...formMap.RecurringTypeID.input}></Select>
                    </Form.Item>
                  </Form.List>
                ));
              }
            }
          })()}
        </Form>
      </div>
    );
  }
}

export default compose(connect(null, actions))(DrawerPaymentPlans);
