import React, { Suspense } from "react";
import GridContent from "components/GridContent";
import AnalysisRow from "./AnalysisRow";
import PageLoading from "components/PageLoading";
import styles from "./DashboardPage.module.scss";

import { visitData } from "__tests__/mockData/charts";

class DashboardPage extends React.Component {
  render() {
    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <AnalysisRow loading={false} error={false} data={visitData} />
        </Suspense>
      </GridContent>
    );
  }
}

export default DashboardPage;
