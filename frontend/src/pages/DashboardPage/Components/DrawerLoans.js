import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/DashboardActions";
import moment from "moment";

import { isEmptyObject } from "utils/utils";

import { FormattedMessage, FormattedNumber } from "react-intl";
import { Button, Form, Input, InputNumber, DatePicker, notification } from "antd";
import { DoubleLeftOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const formMap = {
  LoanName: {
    form: {
      id: "LoanName",
      name: "LoanName",
      label: "Loan Name",
      rules: [{ required: true, message: "Loan name is required!", whitespace: true }]
    },
    input: {
      size: "large"
    }
  },
  LoanBalance: {
    form: {
      id: "LoanBalance",
      name: "LoanBalance",
      label: "Starting Balance",
      rules: [
        { required: true, type: "number", whitespace: true, message: "Balance must be a positive number" },
        { min: 1, type: "number", message: "Must be greater than 0" }
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
  InterestRate: {
    form: {
      id: "InterestRate",
      name: "InterestRate",
      label: "Interest Rate",
      rules: [
        { required: true, type: "number", whitespace: true, message: "Interest rate is required" },
        { min: 0, type: "number", message: "Must be greater than or equal to 0", transform: value => value / 100 }
      ]
    },
    input: {
      size: "large",
      defaultValue: 0,
      step: 0.25,
      min: 0,
      max: 100,
      formatter: value => `${value}%`,
      parser: value => value.replace("%", ""),
      style: { width: "100%" }
    }
  },
  PaymentMinimum: {
    form: {
      id: "PaymentMinimum",
      name: "PaymentMinimum",
      label: "Minimum Payment",
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
  PaymentStart: {
    form: {
      id: "PaymentStart",
      name: "PaymentStart",
      label: "Next Payment Date",
      rules: [{ required: true, type: "object", whitespace: true, message: "Start Date is required!" }]
    },
    input: {
      size: "large",
      disabledDate: current =>
        current &&
        current <= moment().endOf("day") ||
        current > moment().endOf("day").add(1, "month") //prettier-ignore
    }
  },
  StatusID: {
    form: { id: "StatusID", name: "StatusID", label: "Status", rules: [] },
    input: { size: "large" }
  }
};

class DrawerLoans extends React.Component {
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
        LoanName: isExisting ? item.LoanName : null,
        LoanBalance: isExisting ? item.LoanBalance : null,
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
        await this.props.updateExistingLoan({ LoanID: item.LoanID, ...values });
      } else {
        await this.props.createNewLoan(values);
      }

      await this.props.toggleAddEditDrawer(false, null);
    } catch (err) {
      let errMessage = this.state.isExisting ? "There was a problem uppdating the selected loan." : "An unexpected error occured during loan creation";
      notification.error({ duration: 3000, message: errMessage });
    }
  };

  onDelete = async LoanID => {
    try {
      await this.props.deleteExistingLoan(LoanID);

      await this.props.toggleAddEditDrawer(false, null);
    } catch (err) {
      let errMessage = "Loan was unable to be deleted";
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
              Save
            </Button>
            <Button
              type="danger"
              className={`${styles.btnSmall} ${isSaving && styles.btnLoading}`}
              onClick={() => this.onDelete(item.LoanID)}
              loading={isDeleting}
              disabled={isSaving}
            >
              Delete
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
              Save
            </Button>
          </div>
        </div>
      );
    }
  };

  render() {
    let { item, visible } = this.props;

    if (!visible) {
      return null;
    }

    return (
      <div className={styles.editSection}>
        {this.renderHeader()}

        <Form name="newLoan" className={styles.formContainer} ref={this.formRef} layout="vertical" onFinish={this.onFinish}>
          <Form.Item {...formMap.LoanName.form}>
            <Input {...formMap.LoanName.input} />
          </Form.Item>

          <Form.Item {...formMap.LoanBalance.form}>
            <InputNumber {...formMap.LoanBalance.input} />
          </Form.Item>
          <Form.Item {...formMap.InterestRate.form}>
            <InputNumber {...formMap.InterestRate.input} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item {...formMap.PaymentMinimum.form} style={{ display: "inline-block", width: "calc(50% - 5px)", marginRight: 8 }}>
              <InputNumber {...formMap.PaymentMinimum.input} />
            </Form.Item>
            <Form.Item {...formMap.PaymentStart.form} style={{ display: "inline-block", width: "calc(50% - 5px)" }}>
              <DatePicker {...formMap.PaymentStart.input} style={{ width: "100%" }} />
            </Form.Item>
          </Form.Item>

          <Form.Item {...formMap.StatusID.form}>
            <Input {...formMap.StatusID.input} />
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default compose(connect(null, actions))(DrawerLoans);
