import NodeCache from "node-cache";

const appCache = new NodeCache();

export const getRouteCache = duration => {
  return (req, res, next) => {
    let key = `${req.originalUrl || req.url}:${req.user.UserID}`;
    let data = appCache.get(key);

    if (data) {
      res.status(200).json(data);
      return;
    } else {
      res.sendResponse = res.json;
      res.json = body => {
        appCache.set(key, body, duration);
        res.sendResponse(body);
      };
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
