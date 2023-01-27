"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const jwt_decode = require("jwt-decode");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const crypto = require("crypto");

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async exampleAction(ctx) {
    try {
      const email = ctx.request.body.email;
      const tid = ctx.request.body.id;
      const entry = await strapi.db.query("api::order.order").findOne({
        where: { email: email, testid: tid ,status:"paid"},
      });
      if (entry) {
        return { answer: "found", id: entry.id, status: "paid" };
      } else {
        return { answer: "not-found" };
      }
    } catch (err) {
      ctx.body = err;
    }
  },
  async preorder(ctx) {
    try {
      const token = ctx.request.body.token;
      const imp = ctx.request.body.imp;
      let decoded = jwt_decode(token);
      if (imp === JSON.stringify(decoded.id)) {
        const razorpay = new Razorpay({
          key_id: process.env.key_id,
          key_secret: process.env.key_secret,
        });

        // Create an order -> generate the OrderID -> Send it to the Front-end
        const payment_capture = 1;
        const amount = await ctx.request.body.price;
        const currency = "INR";
        const options = {
          amount: (amount * 100).toString(),
          currency,
          receipt: shortid.generate(),
          payment_capture,
        };
        try {
          const response = await razorpay.orders.create(options);
          const entry = await strapi.entityService.create("api::order.order", {
            data: {
              email: ctx.request.body.email,
              order_id: response.id,
              amount: ctx.request.body.price,
              testid: ctx.request.body.testid,
            },
          });
          return entry;
        } catch (error) {
          console.error(error);
        }
      } else {
        return { error: "not found" };
      }
    } catch (error) {
      console.error(error);
    }
  },
  async postorder(ctx) {
    try {
      const hmac = crypto.createHmac("sha256", process.env.key_secret);
      hmac.update(ctx.request.body.oid + "|" + ctx.request.body.pid);
      let generatedSignature = hmac.digest("hex");

      console.log(generatedSignature);
      console.log(ctx.request.body.sid);
      console.log(generatedSignature == ctx.request.body.sid);
      if (generatedSignature == ctx.request.body.sid) {
        const entry = await strapi.entityService.update(
          "api::order.order",
          ctx.request.body.id,
          {
            data: {
              status: "paid",
              paymentinfo: JSON.stringify(ctx.request.body.response),
            },
          }
        );
        return { success: "true", entry };
      } else {
        return {
          success: "false",
          error: "Invalid Payment.Please try again.",
        };
      }
    } catch (error) {
      console.log(error);
    }
  },
}));
