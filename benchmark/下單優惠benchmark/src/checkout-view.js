const { OrderRejected, OrderService } = require("./order-service");

const CAMPAIGN_START = "2026-10-01 00:00:00";
const CAMPAIGN_END = "2026-11-01 00:00:00";

const ACTIVITY_NAMES = {
  "S-TEA-A": "高山烏龍單品特價",
  單品特價: "附加單品特價",
  "M-GOLD": "金卡會員價",
  "P-HOME": "家居九折",
  原價: "原價",
  "B-TEA": "烏龍加紅茶組合價",
  "N-TEA": "茶葉第 2 件半價",
  "T-CASH": "滿額折現",
  "T-FOOD": "食品滿額九折",
  "F-999": "滿 999 免運",
  "G-1200": "滿 1200 贈陶杯",
  "C-80": "折現券 80",
  "C-EXCL": "不可疊加券",
  "C-NOTEA": "排除特價券",
  "C-SHIP50": "運費券",
  "C-SILVER": "銀卡券",
  "A-APP": "App 下單折抵",
  "K-CARD": "信用卡折抵",
  點數: "點數折抵",
};

const STEP1_ORDER = ["S-TEA-A", "單品特價", "M-GOLD", "P-HOME"];

const PRODUCT_LIST = [
  { sku: "TEA-A", name: "高山烏龍", category: "食品" },
  { sku: "TEA-B", name: "紅茶", category: "食品" },
  { sku: "MUG-C", name: "陶杯", category: "家居" },
  { sku: "CARD-D", name: "禮品卡", category: "禮品卡" },
];

const OPTIONS = [
  { key: "member", label: "會員", values: ["一般", "銀卡", "金卡"] },
  { key: "channel", label: "通路", values: ["網頁", "App"] },
  { key: "logistics", label: "物流", values: ["宅配", "超商"] },
  { key: "payment", label: "付款", values: ["非信用卡", "信用卡"] },
  {
    key: "coupon",
    label: "券",
    values: ["無", "C-80", "C-EXCL", "C-NOTEA", "C-SHIP50", "C-SILVER"],
    labels: {
      無: "無",
      "C-80": "折80",
      "C-EXCL": "不可疊加",
      "C-NOTEA": "排除特價",
      "C-SHIP50": "運費券",
      "C-SILVER": "銀卡券",
    },
  },
  { key: "points", label: "點數", kind: "points" },
  {
    key: "giftStock",
    label: "贈品",
    values: ["有", "0"],
    labels: { 有: "有貨", 0: "已送完" },
  },
  {
    key: "createdAt",
    label: "檔期",
    values: [CAMPAIGN_START.replace("01 00:00:00", "15 12:00:00"), CAMPAIGN_END],
    labels: {
      "2026-10-15 12:00:00": "檔期內",
      "2026-11-01 00:00:00": "檔期外",
    },
  },
];

const EXAMPLE_CARTS = [
  {
    name: "一套組合",
    pieces: [
      { sku: "TEA-A", sequence: 1 },
      { sku: "TEA-B", sequence: 1 },
    ],
  },
  {
    name: "組合後滿額",
    pieces: [
      { sku: "TEA-A", sequence: 1 },
      { sku: "TEA-A", sequence: 2 },
      { sku: "TEA-B", sequence: 1 },
    ],
  },
  {
    name: "食品打折並贈陶杯",
    pieces: [
      { sku: "TEA-A", sequence: 1 },
      { sku: "TEA-A", sequence: 2 },
      { sku: "TEA-A", sequence: 3 },
      { sku: "TEA-A", sequence: 4 },
      { sku: "MUG-C", sequence: 1 },
    ],
  },
];

function baselineCheckout() {
  return {
    member: "一般",
    channel: "網頁",
    logistics: "宅配",
    payment: "非信用卡",
    coupon: "無",
    points: 0,
    giftStock: "有",
    createdAt: "2026-10-15 12:00:00",
  };
}

function initialState() {
  return {
    focus: "catalog",
    catalogIndex: 0,
    cartIndex: 0,
    optionIndex: 0,
    cartScroll: 0,
    promoScroll: 0,
    pieces: [],
    nextSequence: 1,
    exampleIndex: 0,
    notice: "方向鍵選商品，Enter 加入購物車",
    ...baselineCheckout(),
  };
}

function shelfPrice(sku) {
  const service = new OrderService();
  const order = service.placeOrder({
    ...baselineCheckout(),
    createdAt: CAMPAIGN_END,
    pieces: [{ sku, sequence: 1 }],
  });
  return order.lines[0].originalPrice;
}

const PRODUCTS = PRODUCT_LIST.map((product) => ({
  ...product,
  shelfPrice: shelfPrice(product.sku),
}));

function productBySku(sku) {
  return (
    PRODUCTS.find((product) => product.sku === sku) || {
      sku,
      name: sku,
      category: "",
      shelfPrice: 0,
    }
  );
}

function optionLabel(option, state) {
  if (option.kind === "points") return String(state.points);
  const value = state[option.key];
  if (option.labels && option.labels[value] !== undefined) return option.labels[value];
  return String(value);
}

function activityName(code) {
  return ACTIVITY_NAMES[code] || code;
}

function inCampaign(createdAt) {
  return createdAt >= CAMPAIGN_START && createdAt < CAMPAIGN_END;
}

function shippingListOf(logistics, createdAt) {
  if (!inCampaign(createdAt)) return 80;
  return logistics === "超商" ? 60 : 80;
}

function requestFrom(state) {
  return {
    member: state.member,
    channel: state.channel,
    logistics: state.logistics,
    payment: state.payment,
    createdAt: state.createdAt,
    points: state.points,
    coupon: state.coupon,
    giftStock: state.giftStock,
    pieces: state.pieces.map((piece) => ({
      sku: piece.sku,
      sequence: piece.sequence,
    })),
  };
}

function parseTags(text) {
  if (!text || text === "無") return [];
  return text
    .split("、")
    .filter(Boolean)
    .map((part) => {
      const index = part.indexOf("：");
      if (index === -1) return { code: part.trim(), detail: "" };
      return {
        code: part.slice(0, index).trim(),
        detail: part.slice(index + 1).trim(),
      };
    });
}

function appliedScope(code) {
  if (code === "G-1200") return "gift";
  if (code === "F-999" || code === "C-SHIP50") return "shipping";
  return "goods";
}

function sumScope(items, scope) {
  return items
    .filter((item) => item.scope === scope)
    .reduce((sum, item) => sum + item.amount, 0);
}

function presentQuote(order, state) {
  const lines = order.lines.map((line) => {
    const product = productBySku(line.sku);
    const step1Discount = line.originalPrice - line.step1Price;
    const laterDiscount = line.step1Price - line.finalAmount;
    return {
      sku: line.sku,
      name: product.name,
      category: product.category,
      sequence: line.sequence,
      originalPrice: line.originalPrice,
      step1Price: line.step1Price,
      step1Activity: line.step1Activity,
      step1Name: activityName(line.step1Activity),
      step1Discount,
      laterDiscount,
      finalAmount: line.finalAmount,
    };
  });

  const step1Buckets = new Map();
  let step1Discount = 0;
  let laterDiscount = 0;
  let listPrice = 0;
  for (const line of lines) {
    listPrice += line.originalPrice;
    step1Discount += line.step1Discount;
    laterDiscount += line.laterDiscount;
    if (line.step1Discount > 0) {
      step1Buckets.set(
        line.step1Activity,
        (step1Buckets.get(line.step1Activity) || 0) + line.step1Discount,
      );
    }
  }

  const triggered = [];
  const seenStep1 = new Set();
  for (const code of STEP1_ORDER) {
    if (!step1Buckets.has(code)) continue;
    seenStep1.add(code);
    triggered.push({
      code,
      name: activityName(code),
      amount: step1Buckets.get(code),
      scope: "step1",
    });
  }
  for (const [code, amount] of step1Buckets) {
    if (seenStep1.has(code)) continue;
    triggered.push({ code, name: activityName(code), amount, scope: "step1" });
  }

  for (const tag of parseTags(order.settlement.applied)) {
    const amount = /^\d+$/.test(tag.detail) ? Number(tag.detail) : 0;
    triggered.push({
      code: tag.code,
      name: activityName(tag.code),
      amount,
      scope: appliedScope(tag.code),
    });
  }

  const pointsDiscount = order.settlement.pointsDiscount;
  if (pointsDiscount > 0) {
    triggered.push({
      code: "點數",
      name: "點數折抵",
      amount: pointsDiscount,
      scope: "points",
      note: `提交 ${state.points}`,
    });
  }

  const skipped = parseTags(order.settlement.unapplied).map((tag) => ({
    code: tag.code,
    name: activityName(tag.code),
    reason: tag.detail || "未採用",
  }));
  if (state.points > 0 && pointsDiscount === 0) {
    skipped.push({
      code: "點數",
      name: "點數折抵",
      reason: `提交 ${state.points}，這次折抵 0`,
    });
  }

  const outsideCampaign = !inCampaign(state.createdAt);
  const shippingList = shippingListOf(state.logistics, state.createdAt);
  const shipping = order.settlement.shipping;
  const orderLevelDiscount = laterDiscount - pointsDiscount;
  const goodsPayable = order.settlement.goodsPayable;
  const orderPayable = order.settlement.orderPayable;
  const stepGap = sumScope(triggered, "step1") - step1Discount;
  const laterGap = sumScope(triggered, "goods") + sumScope(triggered, "points") - laterDiscount;
  const goodsGap = listPrice - step1Discount - laterDiscount - goodsPayable;
  const shipGap = shippingList - sumScope(triggered, "shipping") - shipping;
  const orderGap = goodsPayable + shipping - orderPayable;
  const balanced = [stepGap, laterGap, goodsGap, shipGap, orderGap].every((gap) => gap === 0);

  return {
    lines,
    triggered,
    skipped,
    listPrice,
    step1Discount,
    laterDiscount,
    orderLevelDiscount,
    pointsDiscount,
    goodsPayable,
    shippingList,
    shipping,
    shippingDiscount: shippingList - shipping,
    orderPayable,
    coupon: state.coupon,
    couponConsumed: order.settlement.couponConsumed,
    couponReason: order.settlement.couponReason,
    appliedText: order.settlement.applied,
    unappliedText: order.settlement.unapplied,
    outsideCampaign,
    balanced,
    balanceNote: balanced
      ? ""
      : `明細與結算不一致：步驟1 ${stepGap}、後續 ${laterGap}、商品 ${goodsGap}、運費 ${shipGap}、應付 ${orderGap}`,
    gift: {
      sku: order.settlement.giftSku,
      name: order.settlement.giftSku === "無" ? "無" : productBySku(order.settlement.giftSku).name,
      quantity: order.settlement.giftQuantity,
      lineAmount: order.settlement.giftLineAmount,
      recoveryPrice: order.settlement.giftRecoveryPrice,
      reason: order.settlement.giftReason,
    },
  };
}

function catalogPreview(state) {
  const service = new OrderService();
  const preview = {};
  for (const product of PRODUCTS) {
    try {
      const order = service.placeOrder({
        member: state.member,
        channel: "網頁",
        logistics: "宅配",
        payment: "非信用卡",
        createdAt: state.createdAt,
        points: 0,
        coupon: "無",
        giftStock: "有",
        pieces: [{ sku: product.sku, sequence: 1 }],
      });
      const line = order.lines[0];
      preview[product.sku] = {
        originalPrice: line.originalPrice,
        step1Price: line.step1Price,
        activity: line.step1Activity,
      };
    } catch (error) {
      preview[product.sku] = null;
    }
  }
  return preview;
}

function quoteCart(state) {
  if (state.pieces.length === 0) return { status: "empty" };
  try {
    const order = new OrderService().placeOrder(requestFrom(state));
    return { status: "ok", view: presentQuote(order, state) };
  } catch (error) {
    if (error instanceof OrderRejected) {
      const hint = error.reason === "會員等級不符" ? "銀卡券只能在銀卡會員使用。" : "";
      return {
        status: "error",
        message: hint ? `${error.reason}。${hint}` : error.reason,
      };
    }
    if (error instanceof Error && error.message === "尚未實作") {
      return {
        status: "error",
        message:
          "這個結帳條件還沒有計價。檔期外只支援：一般或金卡、網頁、宅配、非信用卡、點數 0、不使用券。",
      };
    }
    return {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

module.exports = {
  ACTIVITY_NAMES,
  EXAMPLE_CARTS,
  OPTIONS,
  PRODUCTS,
  activityName,
  baselineCheckout,
  catalogPreview,
  initialState,
  optionLabel,
  presentQuote,
  productBySku,
  quoteCart,
};
