import NodeCache from "node-cache";
import logger from "../../logging";

const appCache = new NodeCache();

export const getRouteCache = duration => {
  return (req, res, next) => {
    try {
      let key = `${req.originalUrl || req.url}:${req.user.UserID}`;
      let data = appCache.get(key);

      // If cache data exists for route
      if (data) {
        return res.status(200).json(data);
      } else {
        // If no route cache data,
        // Create cache data for route right before sending reponse to client
        res.sendResponse = res.json;
        res.json = body => {
          appCache.set(key, body, duration);
          return res.sendResponse(body);
        };

        return next();
      }
    } catch (err) {
      logger.error(`Route Cache exception occured: ${err.message}`);
      return next();
    }
  };
};

export const clearCacheCascade = key => {
  return (req, res, next) => {
    let cacheKeys = appCache.keys().filter(k => k.includes(key));
    appCache.del(cacheKeys);

    return next();
  };
};

export const getCachedKey = key => {
  if (!key) return undefined;

  let data = appCache.get(key);

  return data;
};

export const setCachedKey = (key, data) => {
  let result = appCache.set(key, data);

  return result;
};

export const removeCachedKey = key => {
  let result = appCache.del(key);

  return result;
};
