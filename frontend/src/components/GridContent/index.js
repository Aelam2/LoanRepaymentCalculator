import React from "react";
import styles from "./GridContent.module.scss";

const GridContent = props => {
  const { children, contentWidth: propsContentWidth, className: propsClassName, style } = props;
  const contentWidth = propsContentWidth;

  let className = styles.gridContent;
  if (contentWidth === "Fixed") {
    className = `${styles.gridContent} ${styles.wide}`;
  }

  return (
    <div className={`${className} ${propsClassName}`} style={style}>
      {children}
    </div>
  );
};

export default GridContent;
