
module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/order/check',
        handler: 'order.exampleAction',
      },
      {
        method: 'POST',
        path: '/order/preorder',
        handler: 'order.preorder',
      },
      {
        method: 'POST',
        path: '/order/postorder',
        handler: 'order.postorder',
      },
    ],
  };
  