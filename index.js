const fs = require("fs");
const path = require("path");
const TurndownService = require("turndown");
// var turndownPluginGfm = require('@joplin/turndown-plugin-gfm')
var tables = require('@joplin/turndown-plugin-gfm').tables
// var gfm = turndownPluginGfm.gfm

const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  hr: "---",
});

turndownService.use(tables)
turndownService.addRule("pre", {
  filter: "pre",
  replacement: function (content, node) {
    return "```\n" + node.textContent + "\n```";
  },
});
turndownService.keep('span');

// an example is: pnpm run start test.html
const filePath = path.join(__dirname, process.argv[2]); 
const fileContent = fs.readFileSync(filePath, 'utf-8');
const mainRegex = /<main\b[^>]*>([\s\S]*?)<\/main>/i;
const match = fileContent.match(mainRegex);
const mainContent = match ? match[0] : '';
fs.writeFileSync(filePath, mainContent, 'utf-8');
const markdown = turndownService.turndown(fs.readFileSync(filePath, "utf8"));
fs.writeFileSync("output.md", markdown); // Replace 'output.md' with the desired output file name
console.log("Markdown file created successfully!");
