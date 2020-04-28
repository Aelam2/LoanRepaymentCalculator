import { Worker, parentPort, workerData } from "worker_threads";
import logger from "../logging";
import { calculateSchedule } from "../helpers/repaymentCalculator";
import { getCachedKey, setCachedKey } from "../middleware/cache";
import _ from "lodash";

(async () => {
  var hrstart = process.hrtime();
  const { loans, strategyType, payments, currentPlan } = workerData;
  const { cacheMinimumKey, cacheCurrentKey } = workerData;

  let log = {
    success: false,
    cache: {
      minCache: false,
      currentCache: false
    },
    analytics: {
      principal: 0,
      interest: 0,
      total: 0,
      payments: 0
    }
  };

  try {
    // check if user has cached versions of their analytics
    let [cachedMinimumAnalytics, cachedCurrentAnalytics] = await Promise.all([getCachedKey(cacheMinimumKey), getCachedKey(cacheCurrentKey)]);

    // calculate non-cached analytics / schedules
    let [minimumAnalytics, currentAnalytics] = await Promise.all([
      !cachedMinimumAnalytics && calculateSchedule(_.cloneDeep(loans), _.cloneDeep(strategyType), []),
      !cachedCurrentAnalytics && !!currentPlan && calculateSchedule(_.cloneDeep(loans), _.cloneDeep(strategyType), [...payments])
    ]);

    // if cache existed, set result to cache
    if (cachedMinimumAnalytics) {
      log.minCache = true;
      minimumAnalytics = cachedMinimumAnalytics;
    } else {
      // if cache did not exist, set cache to calculated result
      setCachedKey(cacheMinimumKey, minimumAnalytics);
    }

    // if cache existed, set result to cache
    if (cachedCurrentAnalytics) {
      log.currentCache = true;
      currentAnalytics = cachedCurrentAnalytics;
    } else if (!currentPlan) {
      // if no cache and no current plan existed, return minimum plan as the current
      currentAnalytics = minimumAnalytics;
    } else {
      // if cache did not exist, set cache to calculated result
      setCachedKey(cacheCurrentKey, currentAnalytics);
    }

    log.success = true;
    log.analytics = {
      principal: currentAnalytics.principal,
      interest: currentAnalytics.interest,
      total: currentAnalytics.total,
      payments: currentAnalytics.payments
    };

    parentPort.postMessage({ minimumAnalytics, currentAnalytics, cachedMinimumAnalytics, cachedCurrentAnalytics });
  } catch (err) {
    throw new Error(err.message);
  } finally {
    let hrend = process.hrtime(hrstart);

    logger.info(`Analytics Done`, {
      elapsedMilliseconds: hrend[0] * 1000 + hrend[1] / 1000000,
      elapsedSeconds: hrend[0],
      ...log
    });
  }
})();
