module.exports = {
  default: {
    require: [
      "features/support/**/*.js",
      "features/step_definitions/**/*.js",
    ],
    format: [
      ["./formatters/html-report.js", "reports/cucumber-report.html"],
    ],
  },
};
