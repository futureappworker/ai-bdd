const fs = require("node:fs");
const path = require("node:path");
const { finished } = require("node:stream");
const { promisify } = require("node:util");

const themePath = path.join(__dirname, "modern.css");

function themedStylesheet() {
  const packageJson = require.resolve("@cucumber/html-formatter/package.json");
  const officialCss = fs.readFileSync(
    path.join(path.dirname(packageJson), "dist", "main.css"),
    "utf8",
  );
  const themeCss = fs.readFileSync(themePath, "utf8");
  const destination = path.join(__dirname, "..", "tmp", "cucumber-report-theme.css");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${officialCss}\n${themeCss}\n`);
  return destination;
}

module.exports = {
  type: "formatter",
  optionsKey: "html",
  async formatter({ on, options, write, directory }) {
    if (!directory && options.externalAttachments) {
      throw new Error(
        "Unable to externalise attachments when formatter is not writing to a file",
      );
    }

    const { CucumberHtmlStream } = await import("@cucumber/html-formatter");
    const { AttachmentExternalisingStream } = await import(
      "@cucumber/message-streams"
    );

    const externaliseStream = new AttachmentExternalisingStream({
      behaviour: options.externalAttachments,
      directory,
    });
    const htmlStream = new CucumberHtmlStream(themedStylesheet());
    externaliseStream.pipe(htmlStream);
    on("message", (message) => {
      externaliseStream.write(message);
    });
    htmlStream.on("data", (chunk) => write(chunk));

    return async () => {
      externaliseStream.end();
      await promisify(finished)(htmlStream);
    };
  },
};
