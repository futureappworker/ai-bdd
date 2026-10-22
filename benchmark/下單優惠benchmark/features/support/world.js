const { setWorldConstructor, World } = require("@cucumber/cucumber");
const { OrderService } = require("../../src/order-service");

class OrderWorld extends World {
  constructor(options) {
    super(options);
    this.requests = new Map();
    this.results = new Map();
    this.orderService = new OrderService();
  }
}

setWorldConstructor(OrderWorld);
