import { Worker, parentPort, workerData } from "worker_threads";
import { calculateSchedule } from "../helpers/repaymentCalculator";
import { getCachedKey, setCachedKey } from "../middleware/cache";
import _ from "lodash";

(async () => {
  try {
    const { loans, strategyType, payments, currentPlan } = workerData;
    const { cacheMinimumKey, cacheCurrentKey } = workerData;

    // check if user has cached versions of their analytics
    let [cachedMinimumAnalytics, cachedCurrentAnalytics] = await Promise.all([getCachedKey(cacheMinimumKey), getCachedKey(cacheCurrentKey)]);

    // calculate non-cached analytics / schedules
    let [minimumAnalytics, currentAnalytics] = await Promise.all([
      !cachedMinimumAnalytics && calculateSchedule(_.cloneDeep(loans), _.cloneDeep(strategyType), []),
      !cachedCurrentAnalytics && !!currentPlan && calculateSchedule(_.cloneDeep(loans), _.cloneDeep(strategyType), [...payments])
    ]);

    // if cache existed, set result to cache
    if (cachedMinimumAnalytics) {
      minimumAnalytics = cachedMinimumAnalytics;
    } else {
      // if cache did not exist, set cache to calculated result
      setCachedKey(cacheMinimumKey, minimumAnalytics);
    }

    // if cache existed, set result to cache
    if (cachedCurrentAnalytics) {
      currentAnalytics = cachedCurrentAnalytics;
    } else if (!currentPlan) {
      // if no cache and no current plan existed, return minimum plan as the current
      currentAnalytics = minimumAnalytics;
    } else {
      // if cache did not exist, set cache to calculated result
      setCachedKey(cacheCurrentKey, currentAnalytics);
    }
    parentPort.postMessage({ minimumAnalytics, currentAnalytics, cachedMinimumAnalytics, cachedCurrentAnalytics });
  } catch (err) {
    throw new Error(err.message);
  }
})();
