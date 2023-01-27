"use strict";

/**
 * answer controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::answer.answer", ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async exampleAction(ctx) {
    try {
        const email = ctx.request.body.email;
        const tid = ctx.request.body.id;
        const entry = await strapi.db.query('api::answer.answer').findOne({
            where: { email: email,testpid:tid },
          });
          if (entry) {
            return {"answer" :"found","order":entry};
          }else{
              return {"answer" :"not-found"};
          }
    } catch (err) {
      ctx.body = err;
    }
  },
}));
