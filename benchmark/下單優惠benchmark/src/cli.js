#!/usr/bin/env node

const {
  EXAMPLE_CARTS,
  OPTIONS,
  PRODUCTS,
  baselineCheckout,
  catalogPreview,
  initialState,
  optionLabel,
  productBySku,
  quoteCart,
} = require("./checkout-view");

const BG = [12, 16, 22];
const PANEL = [22, 28, 36];
const PANEL_2 = [32, 40, 52];
const TITLE_BG = [18, 24, 32];
const FOOTER_BG = [14, 18, 26];
const LINE = [72, 84, 100];
const TEXT = [236, 232, 222];
const DIM = [148, 158, 170];
const FAINT = [104, 114, 128];
const GOLD = [232, 196, 122];
const GOLD_BG = [62, 48, 24];
const MINT = [126, 201, 167];
const ROSE = [232, 140, 128];
const SKY = [142, 186, 220];
const WHITE = [250, 248, 242];

const FOCUS_ORDER = ["catalog", "cart", "options", "promos"];

function style(fg, bg, bold = false) {
  return { fg, bg, bold };
}

function charWidth(ch) {
  if (!ch) return 0;
  const code = ch.codePointAt(0);
  if (
    (code >= 0x1100 && code <= 0x115f) ||
    (code >= 0x2329 && code <= 0x232a) ||
    (code >= 0x2e80 && code <= 0xa4cf && code !== 0x303f) ||
    (code >= 0xac00 && code <= 0xd7a3) ||
    (code >= 0xf900 && code <= 0xfaff) ||
    (code >= 0xfe10 && code <= 0xfe19) ||
    (code >= 0xfe30 && code <= 0xfe6f) ||
    (code >= 0xff00 && code <= 0xff60) ||
    (code >= 0xffe0 && code <= 0xffe6) ||
    (code >= 0x1f300 && code <= 0x1f64f) ||
    (code >= 0x1f900 && code <= 0x1f9ff) ||
    (code >= 0x20000 && code <= 0x3fffd)
  ) {
    return 2;
  }
  return 1;
}

function widthOf(text) {
  let width = 0;
  for (const ch of String(text)) width += charWidth(ch);
  return width;
}

function fit(text, width) {
  if (width <= 0) return "";
  let out = "";
  let used = 0;
  for (const ch of String(text)) {
    const w = charWidth(ch);
    if (used + w > width) break;
    out += ch;
    used += w;
  }
  return out;
}

function wrap(text, width) {
  const source = String(text);
  if (width <= 0) return [""];
  const lines = [];
  let line = "";
  let used = 0;
  for (const ch of source) {
    const w = charWidth(ch);
    if (used + w > width && line) {
      lines.push(line);
      line = ch;
      used = w;
      continue;
    }
    line += ch;
    used += w;
  }
  if (line || lines.length === 0) lines.push(line);
  return lines;
}

function ansi(value) {
  let out = "\x1b[0m";
  if (value.bg) out += `\x1b[48;2;${value.bg[0]};${value.bg[1]};${value.bg[2]}m`;
  if (value.fg) out += `\x1b[38;2;${value.fg[0]};${value.fg[1]};${value.fg[2]}m`;
  if (value.bold) out += "\x1b[1m";
  return out;
}

function formatMoney(amount) {
  const body = Math.abs(amount).toLocaleString("en-US");
  return amount < 0 ? `-${body}` : body;
}

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.base = style(TEXT, BG);
    this.grid = [];
    for (let y = 0; y < height; y += 1) {
      const row = [];
      for (let x = 0; x < width; x += 1) row.push(this.blank());
      this.grid.push(row);
    }
  }

  blank() {
    return { ch: " ", style: this.base, skip: false };
  }

  fillRect(x, y, w, h, paint, ch = " ") {
    for (let yy = 0; yy < h; yy += 1) {
      for (let xx = 0; xx < w; xx += 1) {
        const px = x + xx;
        const py = y + yy;
        if (px < 0 || py < 0 || px >= this.width || py >= this.height) continue;
        this.grid[py][px] = { ch, style: paint, skip: false };
      }
    }
  }

  erase(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    const cell = this.grid[y][x];
    if (cell.skip && x > 0) {
      const prev = this.grid[y][x - 1];
      if (prev && !prev.skip && charWidth(prev.ch) === 2) this.grid[y][x - 1] = this.blank();
    } else if (cell.ch && charWidth(cell.ch) === 2 && x + 1 < this.width) {
      this.grid[y][x + 1] = this.blank();
    }
    this.grid[y][x] = this.blank();
  }

  put(x, y, text, paint) {
    if (y < 0 || y >= this.height) return;
    let col = x;
    for (const ch of String(text)) {
      const w = charWidth(ch);
      if (col >= this.width || col + w > this.width) return;
      this.erase(col, y);
      if (w === 2) this.erase(col + 1, y);
      this.grid[y][col] = { ch, style: paint, skip: false };
      if (w === 2) this.grid[y][col + 1] = { ch: "", style: paint, skip: true };
      col += w;
    }
  }

  plain() {
    return this.grid
      .map((row) => row.filter((cell) => !cell.skip).map((cell) => cell.ch).join(""))
      .join("\n");
  }

  audit() {
    const problems = [];
    this.grid.forEach((row, y) => {
      let cols = 0;
      row.forEach((cell) => {
        if (cell.skip) return;
        cols += charWidth(cell.ch || " ");
      });
      if (cols !== this.width) problems.push(`y=${y} width=${cols}`);
    });
    return problems;
  }

  toLines() {
    return this.grid.map((row) => {
      let out = "";
      let current = "";
      let chunk = "";
      const flush = () => {
        if (!chunk) return;
        out += current + chunk;
        chunk = "";
      };
      for (const cell of row) {
        if (cell.skip) continue;
        const next = ansi(cell.style);
        if (next !== current) {
          flush();
          current = next;
        }
        chunk += cell.ch;
      }
      flush();
      return `${out}\x1b[0m`;
    });
  }
}

function paint(canvas) {
  const lines = canvas.toLines();
  let out = "\x1b[?7l\x1b[H";
  for (let i = 0; i < lines.length; i += 1) {
    out += `\x1b[${i + 1};1H${lines[i]}`;
  }
  out += "\x1b[?7h";
  return out;
}

function layout(width, height) {
  const headerH = 5;
  const footerH = 2;
  const gap = 1;
  const bodyH = height - headerH - footerH;
  const usable = bodyH - gap;
  let lowerH = Math.min(16, Math.max(9, Math.round(usable * 0.58)));
  let upperH = usable - lowerH;
  if (upperH < 6) {
    upperH = 6;
    lowerH = usable - upperH;
  }
  const catalogW = Math.max(28, Math.min(36, Math.floor((width - gap) * 0.34)));
  const moneyW = width >= 104 ? 36 : 32;
  if (width < 80 || height < 24 || lowerH < 9 || upperH < 6 || catalogW + gap + 28 > width) {
    return { tooSmall: true };
  }
  const top = headerH;
  const lowerY = headerH + upperH + gap;
  return {
    tooSmall: false,
    footerY: height - footerH,
    catalog: { x: 0, y: top, w: catalogW, h: upperH },
    cart: { x: catalogW + gap, y: top, w: width - catalogW - gap, h: upperH },
    promos: { x: 0, y: lowerY, w: width - moneyW - gap, h: lowerH },
    money: { x: width - moneyW, y: lowerY, w: moneyW, h: lowerH },
  };
}

function inset(rect) {
  return {
    x: rect.x + 2,
    y: rect.y + 1,
    w: Math.max(0, rect.w - 4),
    h: Math.max(0, rect.h - 2),
  };
}

function drawBox(canvas, rect, { title, active }) {
  const bg = PANEL;
  const border = style(active ? GOLD : LINE, bg);
  const titleStyle = style(active ? GOLD : TEXT, bg, true);
  canvas.fillRect(rect.x, rect.y, rect.w, rect.h, style(TEXT, bg));
  if (rect.w < 2 || rect.h < 2) return;
  const horizontal = "─".repeat(Math.max(0, rect.w - 2));
  canvas.put(rect.x, rect.y, "╭", border);
  canvas.put(rect.x + 1, rect.y, horizontal, border);
  canvas.put(rect.x + rect.w - 1, rect.y, "╮", border);
  canvas.put(rect.x, rect.y + rect.h - 1, "╰", border);
  canvas.put(rect.x + 1, rect.y + rect.h - 1, horizontal, border);
  canvas.put(rect.x + rect.w - 1, rect.y + rect.h - 1, "╯", border);
  for (let y = rect.y + 1; y < rect.y + rect.h - 1; y += 1) {
    canvas.put(rect.x, y, "│", border);
    canvas.put(rect.x + rect.w - 1, y, "│", border);
  }
  if (title) canvas.put(rect.x + 2, rect.y, fit(` ${title} `, Math.max(0, rect.w - 4)), titleStyle);
}

function appendToken(tokens, token, maxWidth) {
  const used = tokens.reduce((sum, item) => sum + widthOf(item.text), 0);
  if (used + widthOf(token.text) <= maxWidth) tokens.push(token);
}

function drawSegments(canvas, x, y, maxX, segments) {
  let col = x;
  for (const segment of segments) {
    if (!segment.text) continue;
    const room = maxX - col;
    if (room <= 0) break;
    const text = fit(segment.text, room);
    if (!text) break;
    canvas.put(col, y, text, segment.style);
    col += widthOf(text);
    if (widthOf(segment.text) > room) break;
  }
}

function ensurePreview(state) {
  const key = `${state.member}|${state.createdAt}`;
  if (state.previewKey === key && state.preview) return state.preview;
  state.previewKey = key;
  state.preview = catalogPreview(state);
  return state.preview;
}

function payableLabel(quote) {
  if (quote.status === "empty") return "尚未加入商品";
  if (quote.status === "error") return "無法試算";
  return `應付 ${formatMoney(quote.view.orderPayable)}`;
}

function drawTitle(canvas, width, quote) {
  canvas.fillRect(0, 0, width, 1, style(TEXT, TITLE_BG));
  canvas.put(2, 0, "下單優惠驗證", style(GOLD, TITLE_BG, true));
  const right = payableLabel(quote);
  const rightStyle =
    quote.status === "ok"
      ? style(GOLD, TITLE_BG, true)
      : quote.status === "error"
        ? style(ROSE, TITLE_BG, true)
        : style(DIM, TITLE_BG);
  const x = width - widthOf(right) - 2;
  if (x > 18) canvas.put(x, 0, right, rightStyle);
}

function drawStatus(canvas, state, quote, width) {
  const names = { catalog: "商品", cart: "購物車", options: "結帳條件", promos: "優惠明細" };
  const left = `焦點 ${names[state.focus]}    購物車 ${state.pieces.length} 件    ${state.createdAt}`;
  canvas.put(2, 1, fit(left, width - 4), style(DIM, BG));
  if (quote.status !== "error") return;
  const leftWidth = widthOf(fit(left, width - 4));
  const room = width - 4 - leftWidth - 2;
  if (room < 10) return;
  const message = fit(quote.message, room);
  canvas.put(width - widthOf(message) - 2, 1, message, style(ROSE, BG));
}

function drawChips(canvas, state, width) {
  [OPTIONS.slice(0, 4), OPTIONS.slice(4)].forEach((options, rowIndex) => {
    let x = 2;
    const y = 2 + rowIndex;
    options.forEach((option, column) => {
      const index = rowIndex * 4 + column;
      const active = state.focus === "options" && state.optionIndex === index;
      const bg = active ? GOLD_BG : PANEL_2;
      const prefix = ` ${option.label} `;
      const value = `${optionLabel(option, state)} `;
      const chipW = widthOf(prefix) + widthOf(value);
      if (x + chipW > width - 1) return;
      const labelStyle = style(active ? GOLD : DIM, bg, active);
      const valueStyle = style(active ? WHITE : TEXT, bg, active);
      canvas.fillRect(x, y, chipW, 1, labelStyle);
      canvas.put(x, y, prefix, labelStyle);
      canvas.put(x + widthOf(prefix), y, value, valueStyle);
      x += chipW + 1;
    });
  });
}

function selectedBg(selected, focused) {
  return selected && focused ? GOLD_BG : PANEL;
}

function drawCatalog(canvas, rect, state, preview) {
  drawBox(canvas, rect, { title: "商品", active: state.focus === "catalog" });
  const inner = inset(rect);
  const stride = inner.h >= PRODUCTS.length * 2 ? 2 : 1;
  const visible = Math.floor(inner.h / stride);
  PRODUCTS.forEach((product, index) => {
    if (index >= visible) return;
    const selected = index === state.catalogIndex;
    const focused = state.focus === "catalog";
    const bg = selectedBg(selected, focused);
    const y = inner.y + index * stride;
    canvas.fillRect(rect.x + 1, y, rect.w - 2, stride, style(TEXT, bg));
    const seen = preview[product.sku];
    const count = state.pieces.filter((piece) => piece.sku === product.sku).length;
    const marker = { text: selected && focused ? "> " : "  ", style: style(selected && focused ? GOLD : DIM, bg, true) };
    const number = { text: `${index + 1} `, style: style(DIM, bg) };
    const name = { text: product.name, style: style(WHITE, bg, selected && focused) };
    if (stride === 2) {
      const first = [marker, number, name];
      appendToken(first, { text: `  ${product.sku}`, style: style(SKY, bg) }, inner.w);
      if (count > 0) appendToken(first, { text: `  x${count}`, style: style(MINT, bg, true) }, inner.w);
      appendToken(first, { text: `  ${product.category}`, style: style(FAINT, bg) }, inner.w);
      drawSegments(canvas, inner.x, y, inner.x + inner.w, first);
      const second = [{ text: "   ", style: style(DIM, bg) }];
      if (seen && seen.step1Price !== seen.originalPrice) {
        appendToken(second, { text: `定價 ${seen.originalPrice}`, style: style(FAINT, bg) }, inner.w);
        appendToken(second, { text: `  步驟1 ${seen.step1Price}`, style: style(MINT, bg, true) }, inner.w);
        appendToken(second, { text: `  ${seen.activity}`, style: style(SKY, bg) }, inner.w);
      } else if (seen) {
        appendToken(second, { text: `定價 ${seen.originalPrice}`, style: style(TEXT, bg) }, inner.w);
        appendToken(second, { text: `  ${seen.activity}`, style: style(DIM, bg) }, inner.w);
      } else {
        appendToken(second, { text: `定價 ${product.shelfPrice}`, style: style(TEXT, bg) }, inner.w);
      }
      drawSegments(canvas, inner.x, y + 1, inner.x + inner.w, second);
      return;
    }
    const price = seen ? seen.step1Price : product.shelfPrice;
    const discounted = seen && seen.step1Price !== seen.originalPrice;
    const tokens = [marker, number, name];
    appendToken(tokens, { text: `  ${price}`, style: style(discounted ? MINT : TEXT, bg, true) }, inner.w);
    if (count > 0) appendToken(tokens, { text: `  x${count}`, style: style(MINT, bg, true) }, inner.w);
    appendToken(tokens, { text: `  ${product.sku}`, style: style(SKY, bg) }, inner.w);
    if (seen) appendToken(tokens, { text: `  ${seen.activity}`, style: style(DIM, bg) }, inner.w);
    drawSegments(canvas, inner.x, y, inner.x + inner.w, tokens);
  });
}

function pricedFor(quote, piece) {
  if (quote.status !== "ok") return null;
  return (
    quote.view.lines.find((line) => line.sku === piece.sku && line.sequence === piece.sequence) ||
    null
  );
}

function chooseFitted(options, width) {
  const matched = options.find((text) => widthOf(text) <= width);
  return matched || fit(options[options.length - 1], width);
}

function pieceDetail(line, width) {
  if (!line) return fit("  這組結帳條件無法計價", width);
  const later = `後續 ${formatMoney(-line.laterDiscount)}`;
  const final = `本件 ${line.finalAmount}`;
  const options =
    line.step1Discount > 0
      ? [
          `  原價 ${line.originalPrice}  ${line.step1Activity} ${line.step1Price}  單品 ${formatMoney(-line.step1Discount)}  ${later}  ${final}`,
          `  ${line.step1Activity} ${line.step1Price}  單品 ${formatMoney(-line.step1Discount)}  ${later}  ${final}`,
          `  單品 ${formatMoney(-line.step1Discount)}  ${later}  ${final}`,
          `  ${later}  ${final}`,
          `  ${final}`,
        ]
      : [`  原價 ${line.originalPrice}  ${later}  ${final}`, `  ${later}  ${final}`, `  ${final}`];
  return chooseFitted(options, width);
}

function pieceOneLine(piece, line, width) {
  const product = productBySku(piece.sku);
  const head = `#${piece.sequence}  ${product.name}`;
  if (!line) return fit(`${head}  無法計價`, width);
  const final = `本件 ${line.finalAmount}`;
  const later = `後續 ${formatMoney(-line.laterDiscount)}`;
  const options = [
    `${head}  ${line.step1Activity} ${line.step1Price}  ${later}  ${final}`,
    `${head}  ${later}  ${final}`,
    `${head}  ${final}`,
  ];
  return chooseFitted(options, width);
}

function giftPin(view) {
  const gift = view.gift;
  if (gift.sku !== "無") {
    return `贈 ${gift.name} ${gift.sku} x${gift.quantity}  列金額 ${gift.lineAmount}  追回 ${gift.recoveryPrice}`;
  }
  if (gift.reason && gift.reason !== "無") return `贈品未送出 / ${gift.reason}`;
  return "";
}

function ensureScroll(scroll, index, visible) {
  if (visible <= 0) return 0;
  if (index < scroll) return index;
  if (index >= scroll + visible) return index - visible + 1;
  return scroll;
}

function planCart(inner, count) {
  if (count === 0) return { stride: 1, legend: 0, visible: 0 };
  if (inner.w >= 36 && inner.h - 1 >= count * 2) return { stride: 2, legend: 1, visible: count };
  if (inner.w >= 36 && inner.h >= count * 2) return { stride: 2, legend: 0, visible: count };
  if (inner.h >= count) return { stride: 1, legend: 0, visible: count };
  const legend = inner.h >= 8 ? 1 : 0;
  const stride = inner.w >= 36 && inner.h - legend >= 4 ? 2 : 1;
  return {
    stride,
    legend,
    visible: Math.max(1, Math.floor((inner.h - legend) / stride)),
  };
}

function drawCart(canvas, rect, state, quote) {
  const inner = inset(rect);
  const gift = quote.status === "ok" ? giftPin(quote.view) : "";
  const plan = planCart(inner, state.pieces.length);
  const legendH = plan.legend;
  const stride = plan.stride;
  const twoLine = stride === 2;
  const visible = plan.visible;
  const maxScroll = Math.max(0, state.pieces.length - visible);
  let scroll = ensureScroll(state.cartScroll || 0, state.cartIndex, Math.max(visible, 1));
  if (scroll > maxScroll) scroll = maxScroll;
  state.cartScroll = scroll;
  const title =
    state.pieces.length > visible && visible > 0
      ? `購物車 ${state.pieces.length} 件  ${scroll + 1}-${Math.min(state.pieces.length, scroll + visible)}`
      : `購物車 ${state.pieces.length} 件`;
  drawBox(canvas, rect, { title, active: state.focus === "cart" });
  if (inner.h <= 0) return;
  if (state.pieces.length === 0) {
    const lines = ["還沒有商品", "Enter 加入左邊選中的品項", "1 到 4 也可以直接加入"];
    lines.forEach((line, index) => {
      if (index >= inner.h) return;
      canvas.put(inner.x, inner.y + index, fit(line, inner.w), style(index === 0 ? TEXT : DIM, PANEL));
    });
    return;
  }

  if (legendH) {
    canvas.put(
      inner.x,
      inner.y,
      fit("件序不重排    單品折扣、後續分攤、本件金額", inner.w),
      style(FAINT, PANEL),
    );
  }

  for (let i = 0; i < visible; i += 1) {
    const index = scroll + i;
    if (index >= state.pieces.length) break;
    const piece = state.pieces[index];
    const line = pricedFor(quote, piece);
    const product = productBySku(piece.sku);
    const selected = index === state.cartIndex;
    const focused = state.focus === "cart";
    const bg = selectedBg(selected, focused);
    const y = inner.y + legendH + i * stride;
    canvas.fillRect(rect.x + 1, y, rect.w - 2, stride, style(TEXT, bg));
    const marker = selected && focused ? "> " : "  ";
    const body = twoLine
      ? `#${piece.sequence}  ${product.name}  ${piece.sku}`
      : pieceOneLine(piece, line, inner.w - widthOf(marker));
    canvas.put(inner.x, y, fit(`${marker}${body}`, inner.w), style(selected && focused ? WHITE : TEXT, bg, selected && focused));
    if (!twoLine) continue;
    canvas.put(
      inner.x,
      y + 1,
      pieceDetail(line, inner.w),
      style(selected && focused ? GOLD : DIM, bg),
    );
  }

  const used = legendH + visible * stride;
  if (gift && used < inner.h) {
    canvas.put(inner.x, inner.y + used, fit(gift, inner.w), style(MINT, PANEL));
  }
}

function promoModel(quote, width) {
  if (quote.status === "empty") {
    return [
      { type: "head", text: "還沒有試算" },
      { type: "empty", text: "把商品加入購物車之後，這裡列出觸發的優惠" },
      { type: "empty", text: "單品、會員、分類折扣會出現在已觸發" },
      { type: "empty", text: "組合、滿額、券、運費、通路與贈品也列在這裡" },
      { type: "empty", text: "沒有套上的優惠會寫出原因" },
    ];
  }
  if (quote.status === "error") {
    return [
      { type: "head", text: "無法試算" },
      ...wrap(quote.message, width).map((text) => ({ type: "note", text })),
      { type: "empty", text: "調整上方條件後會重新計算" },
    ];
  }

  const view = quote.view;
  const lines = [];
  if (view.outsideCampaign) {
    lines.push({ type: "note", text: "檔期外，商品以原價計算，運費 80。" });
  }
  lines.push({ type: "head", text: "已觸發" });
  if (view.triggered.length === 0) lines.push({ type: "empty", text: "這次沒有觸發優惠" });
  for (const hit of view.triggered) {
    const amount = hit.scope === "gift" ? "贈品" : formatMoney(hit.amount === 0 ? 0 : -hit.amount);
    const note = hit.note ? `  ${hit.note}` : "";
    lines.push({ type: "hit", text: `+ ${hit.code}  ${hit.name}${note}`, amount, scope: hit.scope });
  }
  lines.push({ type: "head", text: "未觸發" });
  if (view.skipped.length === 0) lines.push({ type: "empty", text: "沒有落空的優惠" });
  for (const miss of view.skipped) {
    const left = `- ${miss.code}  ${miss.name}`;
    const reason = miss.reason || "";
    if (reason && widthOf(left) + 1 + widthOf(reason) <= width) {
      lines.push({ type: "miss", text: left, amount: reason });
    } else if (reason) {
      lines.push({ type: "miss", text: left, amount: "" });
      wrap(reason, Math.max(1, width - 2)).forEach((text) => {
        lines.push({ type: "reason", text: `  ${text}` });
      });
    } else {
      lines.push({ type: "miss", text: left, amount: "" });
    }
  }
  if (view.step1Discount > 0) {
    lines.push({ type: "note", text: "單品、會員與分類折扣記在步驟1，不寫進套用欄。" });
  }
  lines.push({ type: "head", text: "結算原文" });
  wrap(`套用  ${view.appliedText}`, width).forEach((text) => lines.push({ type: "raw", text }));
  wrap(`未套用  ${view.unappliedText}`, width).forEach((text) => lines.push({ type: "raw", text }));
  const couponText =
    view.coupon === "無"
      ? "券  無"
      : view.couponReason === "無"
        ? `券  ${view.couponConsumed === "是" ? "已消耗" : "未消耗"}`
        : `券  ${view.couponConsumed === "是" ? "已消耗" : "未消耗"} / ${view.couponReason}`;
  lines.push({ type: "raw", text: couponText });
  if (!view.balanced) lines.push({ type: "note", text: view.balanceNote });
  return lines;
}

function drawPromoLine(canvas, x, y, width, line) {
  const bg = PANEL;
  if (line.type === "head") {
    canvas.put(x, y, fit(line.text, width), style(GOLD, bg, true));
    return;
  }
  if (line.type === "note") {
    canvas.put(x, y, fit(line.text, width), style(SKY, bg));
    return;
  }
  if (line.type === "empty" || line.type === "raw" || line.type === "reason") {
    const fg = line.type === "empty" ? FAINT : DIM;
    canvas.put(x, y, fit(line.text, width), style(fg, bg));
    return;
  }
  const amount = line.amount || "";
  const amountW = widthOf(amount);
  const room = amount ? width - amountW - 1 : width;
  const fg = line.type === "hit" ? TEXT : DIM;
  canvas.put(x, y, fit(line.text, Math.max(0, room)), style(fg, bg));
  if (!amount) return;
  const amountFg = line.type === "hit" ? (line.scope === "gift" ? SKY : MINT) : FAINT;
  canvas.put(x + width - amountW, y, amount, style(amountFg, bg, line.type === "hit"));
}

function drawPromos(canvas, rect, state, quote) {
  const inner = inset(rect);
  const lines = promoModel(quote, Math.max(1, inner.w));
  const maxScroll = Math.max(0, lines.length - inner.h);
  if (state.promoScroll > maxScroll) state.promoScroll = maxScroll;
  if (state.promoScroll < 0) state.promoScroll = 0;
  const shown = Math.min(inner.h, lines.length);
  let title = "本次優惠";
  if (quote.status === "ok") title = `本次優惠  ${quote.view.triggered.length} 項觸發`;
  if (lines.length > inner.h) {
    title += `  ${state.promoScroll + 1}-${state.promoScroll + shown}/${lines.length}`;
  }
  drawBox(canvas, rect, { title, active: state.focus === "promos" });
  for (let i = 0; i < shown; i += 1) {
    drawPromoLine(canvas, inner.x, inner.y + i, inner.w, lines[state.promoScroll + i]);
  }
}

function moneyRows(quote) {
  if (quote.status !== "ok") {
    return [
      ["商品原價", "--", "plain"],
      ["單品與分類", "--", "plain"],
      ["後續優惠", "--", "plain"],
      ["點數折抵", "--", "plain"],
      ["商品應付", "--", "plain"],
      ["運費", "--", "plain"],
      ["訂單應付", "--", "total"],
    ];
  }
  const view = quote.view;
  const shipping =
    view.shippingDiscount > 0
      ? `${view.shippingList} ${formatMoney(-view.shippingDiscount)} -> ${view.shipping}`
      : `${view.shippingList} -> ${view.shipping}`;
  return [
    ["商品原價", formatMoney(view.listPrice), "plain"],
    ["單品與分類", formatMoney(-view.step1Discount), "discount"],
    ["後續優惠", formatMoney(-view.orderLevelDiscount), "discount"],
    ["點數折抵", formatMoney(-view.pointsDiscount), "discount"],
    ["商品應付", formatMoney(view.goodsPayable), "sub"],
    ["運費", shipping, "plain"],
    ["訂單應付", formatMoney(view.orderPayable), view.balanced ? "total" : "bad"],
  ];
}

function drawMoney(canvas, rect, quote) {
  drawBox(canvas, rect, { title: "金額", active: false });
  const inner = inset(rect);
  const rows = moneyRows(quote);
  rows.forEach((row, index) => {
    if (index >= inner.h) return;
    const [label, amount, kind] = row;
    const y = inner.y + index;
    const total = kind === "total" || kind === "bad";
    const bg = total ? GOLD_BG : PANEL;
    if (total) canvas.fillRect(rect.x + 1, y, rect.w - 2, 1, style(GOLD, bg));
    const labelFg = total ? WHITE : DIM;
    const amountFg =
      kind === "bad" ? ROSE : kind === "total" ? GOLD : kind === "discount" && String(amount).startsWith("-") ? MINT : kind === "sub" ? WHITE : TEXT;
    canvas.put(inner.x, y, fit(label, inner.w), style(labelFg, bg, total));
    const amountW = widthOf(amount);
    if (amountW <= inner.w) canvas.put(inner.x + inner.w - amountW, y, amount, style(amountFg, bg, total || kind === "discount"));
  });
  if (quote.status === "ok" && inner.h > rows.length) {
    const y = inner.y + rows.length;
    const text = quote.view.balanced ? "各段加總吻合" : quote.view.balanceNote;
    canvas.put(inner.x, y, fit(text, inner.w), style(quote.view.balanced ? MINT : ROSE, PANEL));
  }
}

function drawFooter(canvas, state, y, width) {
  canvas.fillRect(0, y, width, 2, style(DIM, FOOTER_BG));
  const help = width >= 96
    ? "Tab 切換   Enter 加入   x 移除   左右鍵改條件   [ ] 點數 ±10   D 範例   C 清空   q 離開"
    : "Tab切換  Enter加入  x移除  左右改條件  []點數  D範例  C清空  q離開";
  canvas.put(2, y, fit(help, width - 4), style(DIM, FOOTER_BG));
  canvas.put(2, y + 1, fit(state.notice, width - 4), style(MINT, FOOTER_BG));
}

function drawTooSmall(canvas) {
  const message = "請把終端機放大到至少 80 x 24";
  const x = Math.max(0, Math.floor((canvas.width - widthOf(message)) / 2));
  const y = Math.max(0, Math.floor(canvas.height / 2));
  canvas.put(x, y, fit(message, canvas.width), style(GOLD, BG));
}

function renderFrame(state, width, height) {
  const canvas = new Canvas(width, height);
  const quote = quoteCart(state);
  const boxes = layout(width, height);
  if (boxes.tooSmall) {
    drawTooSmall(canvas);
  } else {
    const preview = ensurePreview(state);
    drawTitle(canvas, width, quote);
    drawStatus(canvas, state, quote, width);
    drawChips(canvas, state, width);
    drawCatalog(canvas, boxes.catalog, state, preview);
    drawCart(canvas, boxes.cart, state, quote);
    drawPromos(canvas, boxes.promos, state, quote);
    drawMoney(canvas, boxes.money, quote);
    drawFooter(canvas, state, boxes.footerY, width);
  }
  return { ansi: paint(canvas), plain: canvas.plain(), audit: canvas.audit() };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function wrapIndex(index, length) {
  if (length <= 0) return 0;
  return (index + length) % length;
}

function shiftFocus(state, direction) {
  const index = FOCUS_ORDER.indexOf(state.focus);
  state.focus = FOCUS_ORDER[wrapIndex(index + direction, FOCUS_ORDER.length)];
}

function move(state, delta) {
  if (state.focus === "catalog") {
    state.catalogIndex = wrapIndex(state.catalogIndex + delta, PRODUCTS.length);
    return;
  }
  if (state.focus === "cart") {
    if (state.pieces.length === 0) return;
    state.cartIndex = wrapIndex(state.cartIndex + delta, state.pieces.length);
    return;
  }
  if (state.focus === "options") {
    state.optionIndex = wrapIndex(state.optionIndex + delta, OPTIONS.length);
    return;
  }
  state.promoScroll += delta;
}

function cycleOption(state, direction) {
  const option = OPTIONS[state.optionIndex];
  if (option.kind === "points") {
    state.points = clamp(state.points + direction * 10, 0, 9990);
    state.notice = `點數改為 ${state.points}`;
    state.promoScroll = 0;
    return;
  }
  const values = option.values;
  const current = values.indexOf(state[option.key]);
  state[option.key] = values[wrapIndex(current + direction, values.length)];
  state.notice = `${option.label}改為${optionLabel(option, state)}`;
  state.promoScroll = 0;
}

function changePoints(state, amount) {
  state.points = clamp(state.points + amount, 0, 9990);
  state.notice = `點數改為 ${state.points}`;
  state.promoScroll = 0;
}

function addProduct(state, index) {
  const product = PRODUCTS[index];
  if (!product) return;
  state.catalogIndex = index;
  const sequence = state.nextSequence;
  state.nextSequence += 1;
  state.pieces.push({ sku: product.sku, sequence });
  state.cartIndex = state.pieces.length - 1;
  state.promoScroll = 0;
  state.notice = `已加入${product.name}，件序 ${sequence}`;
}

function removeAt(state, index) {
  const removed = state.pieces[index];
  if (!removed) return;
  state.pieces.splice(index, 1);
  if (state.cartIndex >= state.pieces.length) state.cartIndex = Math.max(0, state.pieces.length - 1);
  state.promoScroll = 0;
  const product = productBySku(removed.sku);
  state.notice = `已移除件序 ${removed.sequence} 的${product.name}`;
}

function removeSelected(state) {
  if (state.focus === "catalog") {
    const sku = PRODUCTS[state.catalogIndex].sku;
    let index = -1;
    state.pieces.forEach((piece, pieceIndex) => {
      if (piece.sku === sku) index = pieceIndex;
    });
    if (index === -1) {
      state.notice = "這個商品不在購物車裡";
      return;
    }
    removeAt(state, index);
    return;
  }
  if (state.pieces.length === 0) {
    state.notice = "購物車是空的";
    return;
  }
  removeAt(state, Math.min(state.cartIndex, state.pieces.length - 1));
}

function clearCart(state) {
  state.pieces = [];
  state.cartIndex = 0;
  state.cartScroll = 0;
  state.nextSequence = 1;
  state.promoScroll = 0;
  state.notice = "已清空購物車";
}

function loadExample(state) {
  const example = EXAMPLE_CARTS[state.exampleIndex % EXAMPLE_CARTS.length];
  state.exampleIndex += 1;
  Object.assign(state, baselineCheckout());
  state.pieces = example.pieces.map((piece) => ({ ...piece }));
  state.nextSequence = Math.max(...state.pieces.map((piece) => piece.sequence)) + 1;
  state.cartIndex = 0;
  state.cartScroll = 0;
  state.promoScroll = 0;
  state.focus = "promos";
  state.notice = `已載入範例「${example.name}」，結帳條件回到檔期內的一般會員`;
}

function activate(state) {
  if (state.focus === "catalog") {
    addProduct(state, state.catalogIndex);
    return;
  }
  if (state.focus === "cart") {
    const piece = state.pieces[state.cartIndex];
    if (!piece) return;
    const index = PRODUCTS.findIndex((product) => product.sku === piece.sku);
    addProduct(state, index);
    return;
  }
  if (state.focus === "options") cycleOption(state, 1);
}

function nudge(state, direction) {
  if (state.focus !== "options") {
    state.notice = "按 Tab 切到結帳條件後，用左右鍵調整";
    return;
  }
  cycleOption(state, direction);
}

function normalizeKey(key) {
  if (key === "\u0003" || key === "q" || key === "Q") return "quit";
  if (key === "\t") return "tab";
  if (key === "\u001b[Z") return "backtab";
  if (key === "\u001b[A" || key === "k" || key === "K") return "up";
  if (key === "\u001b[B" || key === "j" || key === "J") return "down";
  if (key === "\u001b[C" || key === "l" || key === "L") return "right";
  if (key === "\u001b[D" || key === "h" || key === "H") return "left";
  if (key === "\r" || key === "\n" || key === " ") return "enter";
  if (key === "\u007f" || key === "\u001b[3~" || key === "x" || key === "X" || key === "d") return "remove";
  if (key === "\u0015" || key === "C") return "clear";
  if (key === "[") return "points-down";
  if (key === "]") return "points-up";
  if (key === "{") return "points-down-fast";
  if (key === "}") return "points-up-fast";
  if (key === "D") return "example";
  if (key === "1" || key === "2" || key === "3" || key === "4") return key;
  if (key === "\u001b[5~") return "pageup";
  if (key === "\u001b[6~") return "pagedown";
  return "";
}

function applyKey(state, key) {
  const name = normalizeKey(key);
  if (!name) return "ok";
  if (name === "quit") return "quit";
  if (name === "tab") shiftFocus(state, 1);
  else if (name === "backtab") shiftFocus(state, -1);
  else if (name === "up") move(state, -1);
  else if (name === "down") move(state, 1);
  else if (name === "pageup") move(state, -4);
  else if (name === "pagedown") move(state, 4);
  else if (name === "left") nudge(state, -1);
  else if (name === "right") nudge(state, 1);
  else if (name === "enter") activate(state);
  else if (name === "remove") removeSelected(state);
  else if (name === "clear") clearCart(state);
  else if (name === "points-down") changePoints(state, -10);
  else if (name === "points-up") changePoints(state, 10);
  else if (name === "points-down-fast") changePoints(state, -100);
  else if (name === "points-up-fast") changePoints(state, 100);
  else if (name === "example") loadExample(state);
  else if (name === "1" || name === "2" || name === "3" || name === "4") addProduct(state, Number(name) - 1);
  return "ok";
}

function takeKeys(buffer) {
  const keys = [];
  let i = 0;
  while (i < buffer.length) {
    if (buffer[i] !== "\u001b") {
      keys.push(buffer[i]);
      i += 1;
      continue;
    }
    if (i + 1 >= buffer.length) return { keys, rest: buffer.slice(i) };
    const second = buffer[i + 1];
    if (second !== "[" && second !== "O") {
      i += 1;
      continue;
    }
    let j = i + 2;
    while (j < buffer.length) {
      const code = buffer.charCodeAt(j);
      if (code >= 0x40 && code <= 0x7e) break;
      j += 1;
    }
    if (j >= buffer.length) return { keys, rest: buffer.slice(i) };
    keys.push(buffer.slice(i, j + 1));
    i = j + 1;
  }
  return { keys, rest: "" };
}

function terminalSize() {
  return {
    width: process.stdout.columns || 100,
    height: process.stdout.rows || 36,
  };
}

function main() {
  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    process.stderr.write("請在終端機裡執行：npm run cli\n");
    process.exitCode = 1;
    return;
  }

  const state = initialState();
  let pending = "";
  let restored = false;
  const restore = () => {
    if (restored) return;
    restored = true;
    process.stdout.write("\x1b[0m\x1b[?25h\x1b[?7h\x1b[?1049l");
    process.stdin.setRawMode(false);
  };
  const draw = () => {
    const size = terminalSize();
    process.stdout.write(renderFrame(state, size.width, size.height).ansi);
  };

  process.stdout.write("\x1b[?1049h\x1b[?25l");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    const parsed = takeKeys(pending + chunk);
    pending = parsed.rest;
    for (const key of parsed.keys) {
      if (applyKey(state, key) === "quit") {
        restore();
        process.exit(0);
      }
    }
    draw();
  });
  process.stdout.on("resize", draw);
  process.on("exit", restore);
  process.on("SIGINT", () => {
    restore();
    process.exit(0);
  });
  draw();
}

if (require.main === module) main();

module.exports = {
  applyKey,
  renderFrame,
  takeKeys,
};
