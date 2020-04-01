import React, { Suspense } from "react";
import GridContent from "components/GridContent";
import PageLoading from "components/PageLoading";

import SideMenu from "./Components/SiderMenu";
import AnalysisRow from "./Components/AnalysisRow";
import ChartRow from "./Components/ChartRow";

import styles from "./DashboardPage.module.scss";

import { visitData } from "__tests__/mockData/charts";

class DashboardPage extends React.Component {
  render() {
    return (
      <SideMenu>
        <GridContent>
          <Suspense fallback={<PageLoading />}>
            <AnalysisRow loading={false} error={false} data={visitData} />
          </Suspense>
          <Suspense fallback={<PageLoading />}>
            <ChartRow />
          </Suspense>
        </GridContent>
      </SideMenu>
    );
  }
}

export default DashboardPage;
