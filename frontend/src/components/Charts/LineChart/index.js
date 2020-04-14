import React from "react";
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } from "bizcharts";
import autoHeight from "../autoHeight";
import styles from "./LineChart.module.scss";

const LineChart = props => {
  let {
    height = 1,
    data = [],
    forceFit = true,
    color = "#fc5c9c",
    borderColor = "#fc5c9c",
    scale = { x: {}, y: {} },
    borderWidth = 2,
    line,
    xAxis,
    yAxis,
    animate = true
  } = props;

  const padding = [65, 50, 85, 65];

  const scaleProps = {
    x: {
      type: "cat",
      range: [0, 1],
      ...scale.x
    },
    y: {
      min: 0,
      ...scale.y
    }
  };

  const tooltip = [
    "PaymentDate*Balance",
    (x, y) => ({
      name: x,
      value: y
    })
  ];

  const chartHeight = height + 54;

  const cols = {
    PaymentPaymentDate: {
      range: [0, 1]
    }
  };

  return (
    <div className={styles.miniChart} style={{ height }}>
      <div className={styles.chartContent}>
        {height > 0 && (
          <Chart animate={animate} scale={cols} height={chartHeight} forceFit={forceFit} data={data} padding={padding}>
            <Legend />
            <Axis name="PaymentDate" visible={false} label={null} line={null} tickLine={null} grid={null} />
            <Axis
              name="Balance"
              line={null}
              tickLine={null}
              label={{ textStyle: { fill: "white" }, formatter: val => `$ ${val}` }}
              style={{ color: "white" }}
            />
            <Tooltip
              crosshairs={{
                type: "cross"
              }}
            />
            <Geom type="line" position="PaymentDate*Balance" size={2} color="LoanName" />
            <Geom
              type="point"
              position="PaymentDate*Balance"
              size={4}
              shape={"circle"}
              color="LoanName"
              style={{
                stroke: "#fff",
                lineWidth: 1
              }}
            />
          </Chart>
        )}
      </div>
    </div>
  );
};

export default autoHeight()(LineChart);
