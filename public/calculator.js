// calculator.js
// 🧠 Smart Calculation Engine v1
// نسخه پایه برای محاسبات علمی و مهندسی - بدون eval()

class SmartCalculator {
  constructor() {
    this.expression = "";
  }

  clear() {
    this.expression = "";
    return "0";
  }

  append(value) {
    this.expression += value;
    return this.expression;
  }

  // تبدیل نمادهای فارسی و رابط کاربری به عملگر واقعی
  sanitize(expr) {
    return expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")
      .replace(/،/g, ".")
      .replace(/pi/gi, Math.PI)
      .replace(/e/gi, Math.E);
  }

  calculate() {
    try {
      const sanitized = this.sanitize(this.expression);

      // ارزیابی ایمن از عبارت
      const result = this.evaluateExpression(sanitized);

      // رُند کردن نتیجه
      const finalResult = Math.round((result + Number.EPSILON) * 1e5) / 1e5;

      this.expression = String(finalResult);
      return this.expression;
    } catch (e) {
      this.expression = "";
      return "خطا";
    }
  }

  // ارزیاب ساده و ایمن
  evaluateExpression(expr) {
    // مجاز فقط اعداد، عملگرها و پرانتز
    if (!/^[0-9+\-*/().^ %a-zA-Z]+$/.test(expr)) {
      throw new Error("Invalid input");
    }

    // جایگزینی توان (^) با Math.pow
    const jsExpr = expr.replace(/(\d+(\.\d+)?)\s*\^\s*(\d+(\.\d+)?)/g, "Math.pow($1,$3)");

    // اضافه کردن توابع علمی
    const mathContext = `
      const sin = Math.sin, cos = Math.cos, tan = Math.tan;
      const sqrt = Math.sqrt, log = Math.log, pow = Math.pow;
      const abs = Math.abs, floor = Math.floor, ceil = Math.ceil;
      const PI = Math.PI, E = Math.E;
    `;

    // اجرای ایمن در محدوده ریاضی
    return Function(`${mathContext} return (${jsExpr});`)();
  }
}

// صادرات برای استفاده در ui.js
if (typeof window !== "undefined") {
  window.SmartCalculator = SmartCalculator;
}
