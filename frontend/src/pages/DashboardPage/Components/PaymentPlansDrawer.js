import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/DashboardActions";
import moment from "moment";
import { isEmptyObject } from "utils/utils";

import { FormattedMessage, FormattedNumber } from "react-intl";
import { StickyContainer, Sticky } from "react-sticky";
import { Button, Form, Input, InputNumber, DatePicker, Select, notification, Typography, Tooltip, Collapse } from "antd";
import { DoubleLeftOutlined, InfoCircleOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const { Option } = Select;
const { Paragraph, Text, Title } = Typography;
const { Panel } = Collapse;

const formMap = {
  PlanName: {
    form: {
      id: "PlanName",
      name: "PlanName",
      label: <FormattedMessage id="dashboard.drawer.paymentPlans.form.planName" defaultMessage="Payment Plan Name" />,
      rules: [{ required: true, message: "Plan name is required!", whitespace: true }]
    },
    input: {
      size: "default"
    }
  },

  AllocationMethodID: {
    form: {
      id: "AllocationMethodID",
      name: "AllocationMethodID",
      label: <FormattedMessage id="dashboard.drawer.paymentPlans.form.allocationMethodID" defaultMessage="Allocation Method" />,
      rules: [{ required: true, message: "Allocation Method is required" }]
    },
    input: {
      size: "default"
    }
  },

  PaymentName: {
    form: {
      id: "PaymentName",
      name: "PaymentName",
      label: <FormattedMessage id="dashboard.drawer.loans.form.paymentName" defaultMessage="Payment Name" />,
      rules: [{ required: true, message: "Payment Name is required!", whitespace: true }],
      style: { marginBottom: "5px" }
    },
    input: {
      size: "default"
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
      ],
      style: { marginBottom: "5px" }
    },
    input: {
      size: "default",
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
      rules: [{ required: true, type: "object", whitespace: true, message: "Payment Date is required!" }],
      style: { marginBottom: "5px" }
    },
    input: {
      size: "default",
      picker: "month",
      disabledDate: current => current && current <= moment().endOf("day")
    }
  },

  PaymentDateEnd: {
    form: {
      id: "PaymentDateEnd",
      name: "PaymentDateEnd",
      label: <FormattedMessage id="dashboard.drawer.paymentPlans.form.PaymentDateEnd" defaultMessage="Last Monthly Payment" />,
      rules: [],
      style: { marginBottom: "5px" }
    },
    input: {
      size: "default",
      picker: "month",
      disabledDate: current => current && current <= moment().endOf("day"),
      allowClear: true
    }
  },

  RecurringTypeID: {
    form: {
      id: "RecurringTypeID",
      name: "RecurringTypeID",
      label: <FormattedMessage id="dashboard.drawer.paymentPlans.form.recurringTypeID" defaultMessage="Repeat?" />,
      rules: [{ required: true, message: "Recurring Type is required" }],
      style: { marginBottom: "5px" },
      defaultValue: "6"
    },
    input: {
      size: "default",
      defaultValue: "6"
    }
  }
};

class DrawerPaymentPlans extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExisting: false,
      existingPayments: []
    };

    this.formRef = React.createRef();
  }

  componentDidMount = async () => {
    await this.checkisExistingItem();
    await this.setFieldWithItem();
  };

  componentDidUpdate = async prevProps => {
    if (prevProps.visible !== this.props.visible || JSON.stringify(prevProps.item) !== JSON.stringify(this.props.item)) {
      await this.checkisExistingItem();
      await this.setFieldWithItem();
    }
  };

  // Check if drawer is opened with existing item
  checkisExistingItem = async () => {
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

    if (this.formRef.current && isExisting && item.Payments.length) {
      // Set Exisiting Payments to be rendered by PaymentFormItems Component
      this.setState({
        existingPayments: item.Payments
      });

      // Pre-set Payment Plan Basic Fields
      this.formRef.current.setFieldsValue({
        PlanName: item.PlanName,
        AllocationMethodID: `${item.AllocationMethodID}`
      });
    } else {
      // Pre-set Payment Plan Basic Fields
      this.formRef.current.setFieldsValue({
        PlanName: "New Plan",
        AllocationMethodID: "5"
      });
    }
  };

  onFinish = async values => {
    try {
      let { item } = this.props;
      let { isExisting } = this.state;

      if (isExisting) {
        await this.props.updatePaymentPlan({ PaymentPlanID: item.PaymentPlanID, ...values });
      } else {
        await this.props.createPaymentPlan(values);
      }

      await Promise.all([
        this.props.fetchAmortizationSchedule(this.props.loans.filter(l => l.hidden).map(l => l.LoanID)),
        this.props.toggleAddEditDrawer(false, null)
      ]);
    } catch (err) {
      // let errMessage = this.state.isExisting ? "There was a problem updating the selected Payment Plan." : "An unexpected error occured during plan creation";
      // notification.error({ duration: 3000, message: errMessage });
    }
  };

  onDelete = async PaymentPlanID => {
    try {
      await this.props.deletePaymentPlan(PaymentPlanID);

      await Promise.all([
        this.props.fetchAmortizationSchedule(this.props.loans.filter(l => l.hidden).map(l => l.LoanID)),
        this.props.toggleAddEditDrawer(false, null)
      ]);
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
              onClick={() => this.formRef.current.submit()}
              loading={isSaving}
              disabled={isDeleting}
            >
              {!isSaving && <FormattedMessage id="dashboard.drawer.header.save" defaultMessage="Save" />}
            </Button>
            <Button
              type="danger"
              className={`${styles.btnSmall} ${isSaving && styles.btnLoading}`}
              onClick={() => this.onDelete(item.PaymentPlanID)}
              loading={isDeleting}
              disabled={isSaving}
            >
              {!isDeleting && <FormattedMessage id="dashboard.drawer.header.delete" defaultMessage="Delete" />}
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
            <Button
              type="primary"
              className={`${styles.btnSmall} ${isSaving && styles.btnLoading}`}
              onClick={() => this.formRef.current.submit()}
              loading={isSaving}
            >
              {!isSaving && <FormattedMessage id="dashboard.drawer.header.save" defaultMessage="Save" />}
            </Button>
          </div>
        </div>
      );
    }
  };

  render() {
    let { visible, item } = this.props;
    let { isExisting, existingPayments } = this.state;

    if (!visible) {
      return null;
    }

    return (
      <StickyContainer className={styles.editSection}>
        {this.renderHeader()}
        <Form name="paymentPlan" className={`${styles.formContainer}`} ref={this.formRef} layout="vertical" onFinish={this.onFinish}>
          <Form.Item {...formMap.PlanName.form}>
            <Input {...formMap.PlanName.input} />
          </Form.Item>

          <Form.Item {...formMap.AllocationMethodID.form}>
            <Select>
              <Option value="5">
                <FormattedMessage id="dashboard.drawer.paymentPlans.allocation.avalanche" defaultMessage="Avalanche - Highest Interest First" />
              </Option>
              <Option value="4">
                <FormattedMessage id="dashboard.drawer.paymentPlans.allocation.snowball" defaultMessage="Snowball - Lowest Balance First" />
              </Option>
            </Select>
          </Form.Item>

          <Form.List name="Payments" children>
            {(fields, { add, remove }) => {
              return (
                <div className={`${styles.paymentsListContainer} ant-menu ant-menu-horizontal`}>
                  <Sticky>
                    {({ style }) => (
                      <div
                        className={`${styles.paymentsListHeader}`}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", ...style }}
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
                    )}
                  </Sticky>
                  <PaymentFormItems
                    add={add}
                    remove={remove}
                    isExisting={isExisting}
                    existingPayments={existingPayments}
                    fields={fields}
                    formRef={this.formRef.current || {}}
                  />
                </div>
              );
            }}
          </Form.List>
        </Form>
      </StickyContainer>
    );
  }
}

class PaymentFormItems extends React.Component {
  componentDidMount() {
    let { isExisting } = this.props;

    if (isExisting) {
      this.addExistingPayments();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isExisting !== this.props.isExisting || prevProps.existingPayments.length !== this.props.existingPayments.length) {
      this.addExistingPayments();
    }
  }

  addExistingPayments = () => {
    let { isExisting, existingPayments, add } = this.props;

    if (isExisting && existingPayments.length) {
      existingPayments.map(p => {
        add({
          PaymentID: p.PaymentID,
          PaymentName: p.PaymentName,
          RecurringTypeID: `${p.RecurringTypeID}`,
          PaymentAmount: p.PaymentAmount,
          PaymentDate: moment(p.PaymentDate),
          PaymentDateEnd: p.PaymentDateEnd ? moment(p.PaymentDateEnd) : null
        });
      });
    }
  };

  render() {
    let { remove, fields, formRef } = this.props;
    let { getFieldsValue } = formRef;

    return (
      <Collapse className={`${styles.paymentsListItemContainer}`} bordered={false}>
        {/* Dynamically remove and create payments related to payment plans */}
        {fields.map((field, index) => {
          let title = "Additional Payment";
          let fields = getFieldsValue && getFieldsValue();
          if (getFieldsValue) {
            if (fields.Payments && fields.Payments.length && fields.Payments[index]) {
              title = fields.Payments[index].PaymentName;
            }
          }

          return (
            <Panel
              header={title}
              className="ant-menu"
              key={field.key}
              extra={
                <CloseOutlined
                  onClick={() => {
                    remove(field.name);
                  }}
                />
              }
            >
              <div className={`${styles.paymentsListItem}`}>
                <Form.Item {...formMap.PaymentName.form} name={[field.name, formMap.PaymentName.form.name]} fieldKey={[field.fieldKey, formMap.PaymentName.id]}>
                  <Input {...formMap.PaymentName.input} />
                </Form.Item>
                <Form.Item
                  {...formMap.PaymentAmount.form}
                  name={[field.name, formMap.PaymentAmount.form.name]}
                  fieldKey={[field.fieldKey, formMap.PaymentAmount.id]}
                >
                  <InputNumber {...formMap.PaymentAmount.input} />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Form.Item
                    {...formMap.PaymentDate.form}
                    name={[field.name, formMap.PaymentDate.form.name]}
                    fieldKey={[field.fieldKey, formMap.PaymentDate.id]}
                    style={{ display: "inline-block", width: "calc(50% - 5px)", marginRight: 8 }}
                  >
                    <DatePicker {...formMap.PaymentDate.input} />
                  </Form.Item>
                  <Form.Item
                    {...formMap.RecurringTypeID.form}
                    name={[field.name, formMap.RecurringTypeID.form.name]}
                    fieldKey={[field.fieldKey, formMap.RecurringTypeID.id]}
                    style={{ display: "inline-block", width: "calc(50% - 5px)" }}
                  >
                    <Select {...formMap.RecurringTypeID.input}>
                      <Option key="6">None</Option>
                      <Option key="7">Monthly</Option>
                      <Option key="8">Yearly</Option>
                    </Select>
                  </Form.Item>
                  {/* <Form.Item
                    {...formMap.PaymentDateEnd.form}
                    name={[field.name, formMap.PaymentDateEnd.form.name]}
                    fieldKey={[field.fieldKey, formMap.PaymentDateEnd.id]}
                    style={{ display: fields.Payments && fields.Payments[index].RecurringTypeID == "7" ? "block" : "none" }}
                  >
                    <DatePicker {...formMap.PaymentDateEnd.input} />
                  </Form.Item> */}
                </Form.Item>
              </div>
            </Panel>
          );
        })}
      </Collapse>
    );
  }
}

export default compose(connect(null, actions))(DrawerPaymentPlans);
