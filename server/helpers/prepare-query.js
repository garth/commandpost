module.exports = function (httpQuery) {
  if (httpQuery) {
    if (httpQuery.ids) {
      return { _id: { $in: httpQuery.ids } };
    }
    return httpQuery;
  }
  return {};
};
