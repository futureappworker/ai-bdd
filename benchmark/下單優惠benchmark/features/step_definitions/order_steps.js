const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const { OrderRejected } = require("../../src/order-service");

Given("訂單 {string} 要結帳", function (orderId, table) {
  const raw = table.hashes()[0];
  this.requests.set(orderId, {
    orderId,
    member: raw["會員"],
    channel: raw["通路"],
    logistics: raw["物流"],
    payment: raw["付款"],
    createdAt: raw["建立時間"],
    points: Number(raw["點數"]),
    coupon: raw["券"],
    giftStock: raw["贈品庫存"],
    extraSpecial: raw["附加單品特價"],
    bundlePrice: raw["組合價"] === undefined ? undefined : Number(raw["組合價"]),
    couponFace: raw["券面額"] === undefined ? undefined : Number(raw["券面額"]),
    pieces: [],
  });
});

Given("訂單 {string} 的購買件是", function (orderId, table) {
  const request = this.requests.get(orderId);
  request.pieces = table.hashes().map((row) => ({
    sku: row.SKU,
    sequence: Number(row["件序"]),
  }));
});

When("顧客建立訂單 {string}", function (orderId) {
  const request = this.requests.get(orderId);
  try {
    this.results.set(orderId, this.orderService.placeOrder(request));
  } catch (error) {
    if (!(error instanceof OrderRejected)) {
      throw error;
    }
    this.results.set(orderId, { rejected: true, reason: error.reason });
  }
});

When("顧客試算訂單 {string}", function (orderId) {
  const request = this.requests.get(orderId);
  this.results.set(orderId, this.orderService.quote(request));
});

Then("訂單 {string} 的件明細應該是", function (orderId, table) {
  const order = this.results.get(orderId);
  const expected = table.hashes().map((row) => ({
    sku: row.SKU,
    sequence: Number(row["件序"]),
    originalPrice: Number(row["原價"]),
    step1Price: Number(row["步驟1成交價"]),
    step1Activity: row["步驟1活動"],
    finalAmount: Number(row["最終件金額"]),
  }));
  assert.deepEqual(order.lines, expected);
});

Then("訂單 {string} 的成交結算應該是", function (orderId, table) {
  const order = this.results.get(orderId);
  const row = table.hashes()[0];
  assert.deepEqual(order.settlement, {
    pointsDiscount: Number(row["點數折抵"]),
    shipping: Number(row["運費"]),
    goodsPayable: Number(row["商品應付"]),
    orderPayable: Number(row["訂單應付"]),
    couponConsumed: row["券消耗"],
    couponReason: row["券原因"],
    giftSku: row["贈品SKU"],
    giftQuantity: Number(row["贈品數量"]),
    giftLineAmount: Number(row["贈品列金額"]),
    giftRecoveryPrice: Number(row["追回原價"]),
    giftReason: row["贈品原因"],
    applied: row["套用"],
    unapplied: row["未套用"],
  });
});

Then("訂單 {string} 應該被拒絕建立，原因是 {string}", function (orderId, reason) {
  const result = this.results.get(orderId);
  assert.equal(result.rejected, true);
  assert.equal(result.reason, reason);
});

Given("訂單 {string} 在步驟 {int} 的可計入金額是 {int}", function (orderId, step, amount) {
  const request = this.requests.get(orderId) ?? { orderId };
  request.countableByStep = request.countableByStep ?? {};
  request.countableByStep[step] = amount;
  this.requests.set(orderId, request);
});

Given("訂單 {string} 只有 {string} 達標", function (orderId, code) {
  this.requests.get(orderId).onlyQualified = code;
});

Then("訂單 {string} 的 {string} 折抵應該是 {int}", function (orderId, code, amount) {
  const order = this.results.get(orderId);
  assert.equal(order.discounts[code], amount);
});

Given("訂單 {string} 在步驟 {int} 的食品合計是 {int}", function (orderId, step, amount) {
  const request = this.requests.get(orderId) ?? { orderId };
  request.foodByStep = request.foodByStep ?? {};
  request.foodByStep[step] = amount;
  this.requests.set(orderId, request);
});

Given("訂單 {string} 在步驟 {int} 的家居合計是 {int}", function (orderId, step, amount) {
  const request = this.requests.get(orderId) ?? { orderId };
  request.homeByStep = request.homeByStep ?? {};
  request.homeByStep[step] = amount;
  this.requests.set(orderId, request);
});

Then("訂單 {string} 的 {string} 與 {string} 試算折抵應該都是 {int}", function (orderId, left, right, amount) {
  const order = this.results.get(orderId);
  assert.equal(order.discounts[left], amount);
  assert.equal(order.discounts[right], amount);
});

Then("訂單 {string} 應該採用 {string}", function (orderId, code) {
  assert.equal(this.results.get(orderId).adopted, code);
});

Given("訂單 {string} 的可計入金額已達 {string}", function (orderId, code) {
  const request = this.requests.get(orderId) ?? { orderId };
  request.reached = request.reached ?? [];
  request.reached.push(code);
  this.requests.set(orderId, request);
});

Then("訂單 {string} 的食品折後金額應該是 {int}", function (orderId, amount) {
  assert.equal(this.results.get(orderId).foodAfter, amount);
});

Given("訂單 {string} 的適用商品金額是 {int}", function (orderId, amount) {
  const request = this.requests.get(orderId) ?? { orderId };
  request.applicableAmount = amount;
  this.requests.set(orderId, request);
});

Given("訂單 {string} 提交面額 {int}、門檻 {int} 的折現券", function (orderId, face, threshold) {
  const request = this.requests.get(orderId) ?? { orderId };
  request.submittedFace = face;
  request.submittedThreshold = threshold;
  this.requests.set(orderId, request);
});

Then("訂單 {string} 的實際折抵應該是 {int}", function (orderId, amount) {
  assert.equal(this.results.get(orderId).actualDiscount, amount);
});

Then("訂單 {string} 的商品應付應該是 {int}", function (orderId, amount) {
  assert.equal(this.results.get(orderId).goodsPayable, amount);
});

Given("訂單 {string} 在步驟 {int} 後可被點數折抵的商品金額是 {int}", function (orderId, step, amount) {
  const request = this.requests.get(orderId) ?? { orderId };
  request.pointsEligibleByStep = request.pointsEligibleByStep ?? {};
  request.pointsEligibleByStep[step] = amount;
  this.requests.set(orderId, request);
});

Given("訂單 {string} 的顧客持有 {int} 點", function (orderId, points) {
  const request = this.requests.get(orderId) ?? { orderId };
  request.heldPoints = points;
  this.requests.set(orderId, request);
});

Then("訂單 {string} 的點數折抵應該是 {int}", function (orderId, amount) {
  assert.equal(this.results.get(orderId).pointsDiscount, amount);
});

Given("訂單 {string} 的 {string} 件序 {int} 分攤前金額是 {int}", function (orderId, sku, sequence, amount) {
  const request = this.requests.get(orderId) ?? { orderId, allocationLines: [] };
  request.allocationLines = request.allocationLines ?? [];
  request.allocationLines.push({ sku, sequence, amount });
  this.requests.set(orderId, request);
});

When("訂單 {string} 把 {int} 元折抵分攤到這兩件", function (orderId, discount) {
  const request = this.requests.get(orderId);
  this.results.set(orderId, this.orderService.allocate(request.allocationLines, discount));
});

Then("訂單 {string} 的 {string} 件序 {int} 應該分到折抵 {int}", function (orderId, sku, sequence, amount) {
  const line = this.results.get(orderId).find((item) => item.sku === sku && item.sequence === sequence);
  assert.equal(line.share, amount);
});

Given("訂單 {string} 已成立", function (orderId, table) {
  const raw = table.hashes()[0];
  const numberOrUndefined = (value) => (value === undefined ? undefined : Number(value));
  this.requests.set(orderId, {
    orderId,
    member: raw["會員"],
    channel: raw["通路"],
    logistics: raw["物流"],
    payment: raw["付款"],
    createdAt: raw["建立時間"],
    sku: raw["SKU"],
    sequence: numberOrUndefined(raw["件序"]),
    frozenPrice: numberOrUndefined(raw["成交價"]),
    frozenPayable: numberOrUndefined(raw["應付"]),
    points: numberOrUndefined(raw["點數"]),
    coupon: raw["券"],
    couponConsumed: raw["券已消耗"],
    originalPayable: numberOrUndefined(raw["原應付"]),
    giftReturned: raw["贈品已退回"],
    returnedAt: raw["退貨時間"],
  });
  this.orderService.remember(this.requests.get(orderId));
});

When("商品改價且活動換檔後讀取訂單 {string}", function (orderId) {
  this.results.set(orderId, this.orderService.readOrder(orderId));
});

Then("訂單 {string} 的 {string} 件序 {int} 步驟1成交價應該仍是 {int}", function (orderId, sku, sequence, price) {
  const order = this.results.get(orderId);
  assert.equal(order.sku, sku);
  assert.equal(order.sequence, sequence);
  assert.equal(order.step1Price, price);
});

Then("訂單 {string} 的應付應該仍是 {int}", function (orderId, amount) {
  assert.equal(this.results.get(orderId).payable, amount);
});

Given("訂單 {string} 退貨前的購買件是", function (orderId, table) {
  this.requests.get(orderId).pieces = table.hashes().map((row) => ({
    sku: row.SKU,
    sequence: Number(row["件序"]),
  }));
});

When("顧客對訂單 {string} 退回這些件", function (orderId, table) {
  const request = this.requests.get(orderId);
  const returned = table.hashes().map((row) => ({
    sku: row.SKU,
    sequence: Number(row["件序"]),
  }));
  this.results.set(orderId, this.orderService.returnItems(request, returned));
});

Then("訂單 {string} 的剩餘件明細應該是", function (orderId, table) {
  const order = this.results.get(orderId);
  const expected = table.hashes().map((row) => ({
    sku: row.SKU,
    sequence: Number(row["件序"]),
    originalPrice: Number(row["原價"]),
    step1Price: Number(row["步驟1成交價"]),
    step1Activity: row["步驟1活動"],
    finalAmount: Number(row["最終件金額"]),
  }));
  assert.deepEqual(order.lines, expected);
});

Then("訂單 {string} 的退貨結算應該是", function (orderId, table) {
  const row = table.hashes()[0];
  const settlement = this.results.get(orderId).settlement;
  const expected = {
    goodsPayable: Number(row["剩餘商品應付"]),
    shipping: Number(row["運費"]),
    payable: Number(row["剩餘應付"]),
    refund: Number(row["退款"]),
    due: Number(row["待補金額"]),
    status: row["訂單狀態"],
    giftQualified: row["贈品達標"],
    couponConsumed: row["券消耗"],
    applied: row["套用"],
    unapplied: row["未套用"],
  };
  if (row["贈品SKU"] !== undefined) {
    expected.giftSku = row["贈品SKU"];
    expected.giftQuantity = Number(row["贈品數量"]);
    expected.giftLineAmount = Number(row["贈品列金額"]);
    expected.giftRecoveryPrice = Number(row["追回原價"]);
  }
  const actual = {};
  for (const key of Object.keys(expected)) {
    actual[key] = settlement[key];
  }
  assert.deepEqual(actual, expected);
});
