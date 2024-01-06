const fs = require("fs");
const path = require("path");
const TurndownService = require("turndown");

const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  hr: "---",
});
turndownService.addRule("pre", {
  filter: "pre",
  replacement: function (content, node) {
    return "```\n" + node.textContent + "\n```";
  },
});

turndownService.keep('span');
const filePath = path.join(__dirname, "getting-started.html"); // Replace 'your-file.html' with the actual file name
const fileContent = fs.readFileSync(filePath, 'utf-8');
const mainRegex = /<main\b[^>]*>([\s\S]*?)<\/main>/i;
const match = fileContent.match(mainRegex);
const mainContent = match ? match[0] : '';
fs.writeFileSync(filePath, mainContent, 'utf-8');
const markdown = turndownService.turndown(fs.readFileSync(filePath, "utf8"));
fs.writeFileSync("output.md", markdown); // Replace 'output.md' with the desired output file name
console.log("Markdown file created successfully!");
