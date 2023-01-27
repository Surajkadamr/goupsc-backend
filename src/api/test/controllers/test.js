"use strict";

/**
 * test controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::test.test", ({ strapi }) => ({
  async kannadadata(ctx) {
    try {
      const { id } = ctx.params;
      const entry = await strapi.db.query("api::question.question").findMany({
        where: { Language: "Kannada", test: id },
        populate: {
          test: true,
        },
      });
      if (entry) {
        return { answer: "found", data: entry };
      } else {
        return { answer: "not-found" };
      }
    } catch (err) {
      ctx.body = err;
    }
  },
  async englishdata(ctx) {
    try {
      const { id } = ctx.params;
      const entry = await strapi.db.query("api::question.question").findMany({
        where: { Language: "English", test: id },
        populate: {
          test: true,
        },
      });
      if (entry) {
        return { answer: "found", data: entry };
      } else {
        return { answer: "not-found" };
      }
    } catch (err) {
      ctx.body = err;
    }
  },
}));
