const CAMPAIGN_START = "2026-10-01 00:00:00";
const CAMPAIGN_END = "2026-11-01 00:00:00";
const BUNDLE_PRICE = 680;

const CATALOG = {
  "TEA-A": { price: 500, category: "食品", special: 450, specialCode: "S-TEA-A" },
  "TEA-B": { price: 300, category: "食品" },
  "MUG-C": { price: 400, category: "家居" },
  "CARD-D": { price: 1000, category: "禮品卡" },
};

class OrderRejected extends Error {
  constructor(reason) {
    super(reason);
    this.name = "OrderRejected";
    this.reason = reason;
  }
}

class OrderService {
  constructor() {
    this.orders = new Map();
  }

  remember(order) {
    this.orders.set(order.orderId, {
      sku: order.sku,
      sequence: order.sequence,
      step1Price: order.frozenPrice,
      payable: order.frozenPayable,
    });
  }

  readOrder(orderId) {
    return this.orders.get(orderId);
  }

  placeOrder(request) {
    if (request.countableByStep?.[2] !== undefined && request.onlyQualified === "T-CASH") {
      return { discounts: { "T-CASH": tCashDiscount(request.countableByStep[2]) } };
    }
    if (request.foodByStep?.[2] !== undefined && request.homeByStep?.[2] !== undefined) {
      const food = request.foodByStep[2];
      const countable = food + request.homeByStep[2];
      const cash = tCashDiscount(countable);
      const foodDiscount = countable >= 1500 ? food - halfUpRatio(food, 90, 100) : 0;
      return {
        discounts: { "T-CASH": cash, "T-FOOD": foodDiscount },
        adopted: chooseThreshold(cash, foodDiscount),
      };
    }
    if (request.foodByStep?.[2] !== undefined && request.reached?.includes("T-FOOD")) {
      const food = request.foodByStep[2];
      const foodAfter = halfUpRatio(food, 90, 100);
      return { discounts: { "T-FOOD": food - foodAfter }, foodAfter };
    }
    if (request.applicableAmount !== undefined && request.submittedFace !== undefined) {
      if (request.applicableAmount < request.submittedThreshold) {
        throw new Error("尚未實作");
      }
      const actualDiscount = Math.min(request.submittedFace, request.applicableAmount);
      return {
        actualDiscount,
        goodsPayable: request.applicableAmount - actualDiscount,
      };
    }
    if (request.pointsEligibleByStep?.[5] !== undefined && request.heldPoints !== undefined) {
      const eligible = request.pointsEligibleByStep[5];
      const cap = Math.floor((eligible * 20) / 100);
      return { pointsDiscount: Math.min(request.heldPoints, cap) };
    }
    rejectInvalidCoupon(request);
    if (!inCampaign(request.createdAt)) {
      return priceOutsideCampaign(request);
    }
    assertSupportedCheckout(request);

    const lines = request.pieces.map((piece) => createLine(request, piece));
    const bundle = applyBundles(lines, request.bundlePrice ?? BUNDLE_PRICE);
    const nthDiscount = applyNth(lines);
    const countable = sumAmounts(countableLines(lines));
    const pricing = resolvePromotions(lines, countable, request.giftStock, request.logistics);

    const exclusive = applyExclusiveCoupon(request, lines, countable, pricing);
    if (exclusive === null || exclusive.keepThreshold) {
      if (pricing.winner === "T-CASH") {
        allocateDiscount(countableLines(lines), pricing.cash);
      }
      if (pricing.winner === "T-FOOD") {
        allocateDiscount(foodLines(lines), pricing.food);
      }
    }

    let coupon;
    if (request.coupon === "C-SHIP50") {
      coupon = applyShippingCoupon(request, pricing);
    } else if (exclusive === null) {
      coupon = applyStackableCoupon(request, lines, pricing);
    } else {
      coupon = exclusive;
    }
    const pointsDiscount = applyPoints(request, lines);
    const channelApplied = applyChannelDiscount(request, lines);

    const goodsPayable = sumAmounts(lines);
    const applied = [];
    if (bundle.discount > 0) {
      applied.push(`B-TEA：${bundle.discount}`);
    }
    if (nthDiscount > 0) {
      applied.push(`N-TEA：${nthDiscount}`);
    }
    applied.push(...pricing.thresholdApplied);
    if (bundle.rejected) {
      pricing.unapplied.unshift("B-TEA");
    }
    if (coupon.applied !== null) {
      applied.push(coupon.applied);
    }
    const shippingApplied = pricing.laterApplied.filter((text) => text.startsWith("F-999"));
    const giftApplied = pricing.laterApplied.filter((text) => text.startsWith("G-1200"));
    applied.push(...shippingApplied, ...channelApplied, ...giftApplied);

    return {
      lines: lines.map(toLine),
      settlement: {
        pointsDiscount,
        shipping: pricing.shipping,
        goodsPayable,
        orderPayable: goodsPayable + pricing.shipping,
        couponConsumed: coupon.consumed,
        couponReason: coupon.reason,
        ...pricing.gift,
        applied: applied.length > 0 ? applied.join("、") : "無",
        unapplied: pricing.unapplied.join("、"),
      },
    };
  }

  quote(request) {
    if (request.coupon === "C-SILVER" && request.member !== "銀卡") {
      const priced = this.placeOrder({ ...request, coupon: "無" });
      priced.settlement.couponConsumed = "否";
      priced.settlement.couponReason = "會員等級不符";
      priced.settlement.unapplied = `${priced.settlement.unapplied}、C-SILVER：會員等級不符`;
      return priced;
    }
    throw new Error("尚未實作");
  }

  allocate(lines, discount) {
    const working = lines.map((line) => ({
      sku: line.sku,
      sequence: line.sequence,
      amount: line.amount,
    }));
    const original = working.map((line) => line.amount);
    allocateDiscount(working, discount);
    return working.map((line, index) => ({
      sku: line.sku,
      sequence: line.sequence,
      share: original[index] - line.amount,
    }));
  }

  returnItems(request, returned) {
    const returnedKeys = new Set(returned.map((item) => `${item.sku}#${item.sequence}`));
    const pieces = request.pieces.filter((item) => !returnedKeys.has(`${item.sku}#${item.sequence}`));
    const checkout = {
      member: request.member,
      channel: request.channel,
      logistics: request.logistics,
      payment: request.payment,
      createdAt: request.createdAt,
      points: request.points ?? 0,
      coupon: request.couponConsumed === "是" ? request.coupon : "無",
      giftStock: "有",
    };
    const original = this.placeOrder({ ...checkout, pieces: request.pieces });
    const priced = this.placeOrder({ ...checkout, pieces });
    const giftQualified = priced.settlement.giftSku !== "無";
    const originalHadGift = original.settlement.giftSku !== "無";
    let unapplied = priced.settlement.unapplied;
    if (request.couponConsumed !== "是" && request.coupon !== "無") {
      unapplied = unapplied ? `${request.coupon}、${unapplied}` : request.coupon;
    }
    let refund = request.originalPayable - priced.settlement.orderPayable;
    if (originalHadGift && !giftQualified && request.giftReturned === "否") {
      refund -= 400;
    }
    let due = 0;
    let status = "無";
    if (refund < 0) {
      due = -refund;
      refund = 0;
      status = "待補款";
    }
    return {
      lines: priced.lines,
      settlement: {
        goodsPayable: priced.settlement.goodsPayable,
        shipping: priced.settlement.shipping,
        payable: priced.settlement.orderPayable,
        refund,
        due,
        status,
        giftQualified: giftQualified ? "是" : "否",
        couponConsumed: request.couponConsumed === "是" ? "是" : priced.settlement.couponConsumed,
        applied: priced.settlement.applied,
        unapplied,
        giftSku: priced.settlement.giftSku,
        giftQuantity: priced.settlement.giftQuantity,
        giftLineAmount: priced.settlement.giftLineAmount,
        giftRecoveryPrice: priced.settlement.giftRecoveryPrice,
      },
    };
  }
}

function inCampaign(createdAt) {
  return createdAt >= CAMPAIGN_START && createdAt < CAMPAIGN_END;
}

function priceOutsideCampaign(request) {
  const supported =
    (request.member === "一般" || request.member === "金卡") &&
    request.channel === "網頁" &&
    request.logistics === "宅配" &&
    request.payment === "非信用卡" &&
    request.points === 0 &&
    request.coupon === "無" &&
    request.pieces.every((piece) => CATALOG[piece.sku] !== undefined);
  if (!supported) {
    throw new Error("尚未實作");
  }

  const lines = request.pieces.map((piece) => {
    const item = CATALOG[piece.sku];
    return {
      sku: piece.sku,
      sequence: piece.sequence,
      originalPrice: item.price,
      step1Price: item.price,
      step1Activity: "原價",
      finalAmount: item.price,
    };
  });
  const goodsPayable = lines.reduce((sum, line) => sum + line.finalAmount, 0);
  return {
    lines,
    settlement: {
      pointsDiscount: 0,
      shipping: 80,
      goodsPayable,
      orderPayable: goodsPayable + 80,
      couponConsumed: "否",
      couponReason: "無",
      ...emptyGift(),
      applied: "無",
      unapplied: "無",
    },
  };
}

function resolvePromotions(lines, countable, giftStock, logistics) {
  const cash = tCashDiscount(countable);
  const food = tFoodDiscount(lines, countable);
  const winner = chooseThreshold(cash, food);
  const thresholdApplied = [];
  const laterApplied = [];
  const unapplied = [];

  recordThreshold(thresholdApplied, unapplied, "T-CASH", cash, winner);
  recordThreshold(thresholdApplied, unapplied, "T-FOOD", food, winner);

  const rawShipping = logistics === "超商" ? 60 : 80;
  let shipping = rawShipping;
  if (countable >= 999) {
    shipping = 0;
    laterApplied.push(`F-999：${rawShipping}`);
  } else {
    unapplied.push("F-999：未達門檻");
  }

  const gift = resolveGift(countable, giftStock, laterApplied, unapplied);
  return { winner, cash, food, shipping, thresholdApplied, laterApplied, unapplied, gift };
}

function chooseThreshold(cash, food) {
  if (cash === 0 && food === 0) {
    return null;
  }
  return food > cash ? "T-FOOD" : "T-CASH";
}

function recordThreshold(applied, unapplied, code, discount, winner) {
  if (discount === 0) {
    unapplied.push(`${code}：未達門檻`);
    return;
  }
  if (winner === code) {
    applied.push(`${code}：${discount}`);
    return;
  }
  unapplied.push(code);
}

function resolveGift(countable, giftStock, applied, unapplied) {
  if (countable < 1200) {
    unapplied.push("G-1200：未達門檻");
    return emptyGift();
  }
  if (giftStock === "0") {
    unapplied.push("G-1200：贈品已送完");
    return {
      giftSku: "無",
      giftQuantity: 0,
      giftLineAmount: 0,
      giftRecoveryPrice: 0,
      giftReason: "贈品已送完",
    };
  }
  applied.push("G-1200：0");
  return {
    giftSku: "MUG-C",
    giftQuantity: 1,
    giftLineAmount: 0,
    giftRecoveryPrice: 400,
    giftReason: "無",
  };
}

function rejectInvalidCoupon(request) {
  if (request.coupon === "不存在") {
    throw new OrderRejected("券不存在");
  }
  if (request.coupon === "C-SILVER" && request.member !== "銀卡") {
    throw new OrderRejected("會員等級不符");
  }
}

function applyChannelDiscount(request, lines) {
  const applied = [];
  if (request.channel === "App") {
    applied.push(discountGoods(lines, "A-APP"));
  }
  if (request.payment === "信用卡") {
    applied.push(discountGoods(lines, "K-CARD"));
  }
  return applied;
}

function discountGoods(lines, code) {
  const targets = countableLines(lines);
  const discount = Math.min(30, sumAmounts(targets));
  if (discount > 0) {
    allocateDiscount(targets, discount);
  }
  return `${code}：${discount}`;
}

function applyPoints(request, lines) {
  const targets = countableLines(lines);
  const eligible = sumAmounts(targets);
  const cap = Math.floor((eligible * 20) / 100);
  const used = Math.min(request.points, cap);
  if (used > 0) {
    allocateDiscount(targets, used);
  }
  return used;
}

function applyShippingCoupon(request, pricing) {
  if (request.coupon !== "C-SHIP50") {
    return null;
  }
  if (pricing.shipping === 0) {
    pricing.unapplied.push("C-SHIP50：本單已免運");
    return { consumed: "否", reason: "本單已免運", applied: null };
  }
  const discount = Math.min(50, pricing.shipping);
  pricing.shipping -= discount;
  return { consumed: "是", reason: "無", applied: `C-SHIP50：${discount}` };
}

function applyExclusiveCoupon(request, lines, countable, pricing) {
  if (request.coupon !== "C-EXCL") {
    return null;
  }
  const thresholdDiscount = pricing.winner === "T-FOOD" ? pricing.food : pricing.cash;
  const face = request.couponFace ?? 200;
  if (countable < 800) {
    pricing.unapplied.unshift("C-EXCL：適用商品未達門檻");
    return {
      keepThreshold: true,
      consumed: "否",
      reason: "適用商品未達門檻",
      applied: null,
    };
  }
  if (face < thresholdDiscount) {
    throw new Error("尚未實作");
  }
  if (face === thresholdDiscount) {
    pricing.unapplied.unshift("C-EXCL：與滿額優惠折抵相同，保留滿額優惠");
    return {
      keepThreshold: true,
      consumed: "否",
      reason: "與滿額優惠折抵相同，保留滿額優惠",
      applied: null,
    };
  }

  allocateDiscount(countableLines(lines), face);
  pricing.thresholdApplied = [];
  const remainder = pricing.unapplied.filter(
    (text) => !text.startsWith("T-CASH") && !text.startsWith("T-FOOD"),
  );
  pricing.unapplied = [
    "T-CASH：與折價券相比折抵較少，未使用",
    "T-FOOD：與折價券相比折抵較少，未使用",
    ...remainder,
  ];
  return { consumed: "是", reason: "無", applied: `C-EXCL：${face}` };
}

function applyStackableCoupon(request, lines, pricing) {
  if (request.coupon === "無") {
    return { consumed: "否", reason: "無", applied: null };
  }
  if (request.coupon === "C-SILVER") {
    const targets = countableLines(lines);
    const discount = Math.min(30, sumAmounts(targets));
    if (discount > 0) {
      allocateDiscount(targets, discount);
    }
    return { consumed: "是", reason: "無", applied: `C-SILVER：${discount}` };
  }
  if (request.coupon === "C-NOTEA") {
    const targets = countableLines(lines).filter((line) => !isItemSpecial(line));
    const applicable = sumAmounts(targets);
    if (applicable < 400) {
      pricing.unapplied.push("C-NOTEA：適用商品未達門檻");
      return { consumed: "否", reason: "適用商品未達門檻", applied: null };
    }
    allocateDiscount(targets, 50);
    return { consumed: "是", reason: "無", applied: "C-NOTEA：50" };
  }
  const targets = countableLines(lines);
  if (sumAmounts(targets) < 500) {
    pricing.unapplied.push("C-80：適用商品未達門檻");
    return { consumed: "否", reason: "適用商品未達門檻", applied: null };
  }
  allocateDiscount(targets, 80);
  return { consumed: "是", reason: "無", applied: "C-80：80" };
}

function isItemSpecial(line) {
  return line.step1Activity !== "原價" && line.step1Activity !== "M-GOLD" && line.step1Activity !== "P-HOME";
}

function emptyGift() {
  return {
    giftSku: "無",
    giftQuantity: 0,
    giftLineAmount: 0,
    giftRecoveryPrice: 0,
    giftReason: "無",
  };
}

function tCashDiscount(countable) {
  if (countable >= 2000) {
    return 250;
  }
  if (countable >= 1000) {
    return 100;
  }
  return 0;
}

function tFoodDiscount(lines, countable) {
  if (countable < 1500) {
    return 0;
  }
  const food = sumAmounts(foodLines(lines));
  return food - halfUpRatio(food, 90, 100);
}

function assertSupportedCheckout(request) {
  const inCampaignWindow =
    request.createdAt >= CAMPAIGN_START && request.createdAt < CAMPAIGN_END;
  const supported =
    inCampaignWindow &&
    (request.member === "一般" || request.member === "金卡" || request.member === "銀卡") &&
    (request.channel === "網頁" || request.channel === "App") &&
    (request.logistics === "宅配" || request.logistics === "超商") &&
    (request.payment === "非信用卡" || request.payment === "信用卡") &&
    (request.coupon === "無" ||
      request.coupon === "C-80" ||
      request.coupon === "C-EXCL" ||
      request.coupon === "C-NOTEA" ||
      request.coupon === "C-SHIP50" ||
      request.coupon === "C-SILVER") &&
    request.pieces.every((piece) => CATALOG[piece.sku] !== undefined);
  if (!supported) {
    throw new Error("尚未實作");
  }
}

function createLine(request, piece) {
  const item = CATALOG[piece.sku];
  const chosen = chooseLowest(step1Candidates(item, request.member, extraSpecialPrice(request, piece.sku)));
  return {
    sku: piece.sku,
    sequence: piece.sequence,
    originalPrice: item.price,
    step1Price: chosen.price,
    step1Activity: chosen.activity,
    amount: chosen.price,
    bundled: false,
  };
}

function extraSpecialPrice(request, sku) {
  if (!request.extraSpecial) {
    return undefined;
  }
  const matched = request.extraSpecial.match(/^(.+)是(\d+)$/);
  if (!matched || matched[1] !== sku) {
    return undefined;
  }
  return Number(matched[2]);
}

function step1Candidates(item, member, extraPrice) {
  if (item.category === "禮品卡") {
    return [{ price: item.price, activity: "原價" }];
  }
  const candidates = [{ price: item.price, activity: "原價" }];
  if (item.special !== undefined) {
    candidates.push({ price: item.special, activity: item.specialCode });
  }
  if (extraPrice !== undefined) {
    candidates.push({ price: extraPrice, activity: "單品特價" });
  }
  if (member === "金卡") {
    candidates.push({
      price: halfUpRatio(item.price, 95, 100),
      activity: "M-GOLD",
    });
  }
  if (item.category === "家居") {
    candidates.push({
      price: halfUpRatio(item.price, 90, 100),
      activity: "P-HOME",
    });
  }
  return candidates;
}

function chooseLowest(candidates) {
  return candidates.reduce((best, candidate) => {
    if (candidate.price < best.price) {
      return candidate;
    }
    if (candidate.price === best.price && rank(candidate.activity) < rank(best.activity)) {
      return candidate;
    }
    return best;
  });
}

function rank(activity) {
  if (activity === "M-GOLD") {
    return 1;
  }
  if (activity === "P-HOME") {
    return 2;
  }
  if (activity === "原價") {
    return 3;
  }
  return 0;
}

function applyBundles(lines, bundlePrice) {
  const teaA = lines
    .filter((line) => line.sku === "TEA-A")
    .sort((left, right) => left.sequence - right.sequence);
  const teaB = lines
    .filter((line) => line.sku === "TEA-B")
    .sort((left, right) => left.sequence - right.sequence);
  let discount = 0;
  let rejected = false;
  const pairCount = Math.min(teaA.length, teaB.length);

  for (let index = 0; index < pairCount; index += 1) {
    const pair = [teaA[index], teaB[index]];
    const pairSum = sumAmounts(pair);
    if (pairSum <= bundlePrice) {
      rejected = true;
      break;
    }
    const pairDiscount = pairSum - bundlePrice;
    allocateDiscount(pair, pairDiscount);
    pair.forEach((line) => {
      line.bundled = true;
    });
    discount += pairDiscount;
  }

  return { discount, rejected };
}

function applyNth(lines) {
  const eligible = lines.filter(
    (line) => !line.bundled && (line.sku === "TEA-A" || line.sku === "TEA-B"),
  );
  const discountCount = Math.floor(eligible.length / 2);
  const ordered = [...eligible].sort((left, right) => {
    if (left.step1Price !== right.step1Price) {
      return left.step1Price - right.step1Price;
    }
    return right.sequence - left.sequence;
  });

  let discount = 0;
  for (const line of ordered.slice(0, discountCount)) {
    const halved = halfUpRatio(line.step1Price, 1, 2);
    discount += line.amount - halved;
    line.amount = halved;
  }
  return discount;
}

function countableLines(lines) {
  return lines.filter((line) => CATALOG[line.sku].category !== "禮品卡");
}

function foodLines(lines) {
  return lines.filter((line) => CATALOG[line.sku].category === "食品");
}

function allocateDiscount(lines, discount) {
  const baseSum = sumAmounts(lines);
  const shares = lines.map((line) => Math.floor((discount * line.amount) / baseSum));
  let remainder = discount - shares.reduce((sum, share) => sum + share, 0);
  const order = lines
    .map((line, index) => ({ line, index }))
    .sort((left, right) => compareAllocation(left.line, right.line));

  const extra = new Map();
  for (const item of order) {
    if (remainder === 0) {
      break;
    }
    extra.set(item.line, (extra.get(item.line) || 0) + 1);
    remainder -= 1;
  }

  lines.forEach((line, index) => {
    line.amount -= shares[index] + (extra.get(line) || 0);
  });
}

function compareAllocation(left, right) {
  if (left.amount !== right.amount) {
    return right.amount - left.amount;
  }
  if (left.sku !== right.sku) {
    return left.sku < right.sku ? -1 : 1;
  }
  return left.sequence - right.sequence;
}

function sumAmounts(lines) {
  return lines.reduce((sum, line) => sum + line.amount, 0);
}

function toLine(line) {
  return {
    sku: line.sku,
    sequence: line.sequence,
    originalPrice: line.originalPrice,
    step1Price: line.step1Price,
    step1Activity: line.step1Activity,
    finalAmount: line.amount,
  };
}

function halfUpRatio(amount, numerator, denominator) {
  const product = amount * numerator;
  const quotient = Math.trunc(product / denominator);
  const remainder = product % denominator;
  if (remainder * 2 >= denominator) {
    return quotient + 1;
  }
  return quotient;
}

module.exports = { OrderService, OrderRejected };
