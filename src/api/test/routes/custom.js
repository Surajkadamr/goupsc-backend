module.exports = {
  routes: [
    {
      method: "GET",
      path: "/test/english/:id",
      handler: "test.englishdata",
    },
    {
      method: "GET",
      path: "/test/kannada/:id",
      handler: "test.kannadadata",
    },
  ],
};
