import React from "react";
import { Card, Typography } from "antd";
import classNames from "classnames";
import styles from "./ChartCard.module.scss";

const { Title, Text } = Typography;

class ChartCard extends React.Component {
  renderTotal = total => {
    if (!total && total !== 0) {
      return null;
    }
    let totalDom;
    switch (typeof total) {
      case "undefined":
        totalDom = null;
        break;
      case "function":
        totalDom = (
          <Title className={styles.total} level={3}>
            {total()}
          </Title>
        );
        break;
      default:
        totalDom = (
          <Title className={styles.total} level={3}>
            {total}
          </Title>
        );
    }
    return totalDom;
  };

  renderContent = () => {
    const { contentHeight, title, avatar, action, total, footer, children, loading } = this.props;

    if (loading) {
      return false;
    }

    return (
      <div className={styles.chartCard}>
        <div
          className={classNames(styles.chartTop, {
            [styles.chartTopMargin]: !children && !footer
          })}
        >
          <div className={styles.avatar}>{avatar}</div>
          <div className={styles.metaWrap}>
            <div className={styles.meta}>
              <Text className={styles.title} type="secondary">
                {title}
              </Text>
              <Text className={styles.action} type="secondary">
                {action}
              </Text>
            </div>
            {this.renderTotal(total)}
          </div>
        </div>
        {children && (
          <div className={styles.content} style={{ height: contentHeight || "auto" }}>
            <div className={contentHeight && styles.contentFixed}>{children}</div>
          </div>
        )}
        {footer && (
          <div
            className={classNames(styles.footer, {
              [styles.footerMargin]: !children
            })}
          >
            {footer}
          </div>
        )}
      </div>
    );
  };

  render() {
    const { loading = false, contentHeight, children, title, avatar, action, total, footer, ...rest } = this.props;
    return (
      <Card loading={loading} bodyStyle={{ padding: "20px 24px 8px 24px" }} {...rest}>
        {this.renderContent()}
      </Card>
    );
  }
}

export default ChartCard;
