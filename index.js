const fs = require("fs");
const path = require("path");
const TurndownService = require("joplin-turndown");
var tables = require('joplin-turndown-plugin-gfm').tables

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
turndownService.use(tables)

// an example is: pnpm run start test.html
const filePath = path.join(__dirname, process.argv[2]); 

const fileContent = fs.readFileSync(filePath, 'utf-8');
const mainRegex = /<main\b[^>]*>([\s\S]*?)<\/main>/i;
const match = fileContent.match(mainRegex);
const mainContent = match ? match[0] : '';
const escapedContent = mainContent.replace(/ \| /gi, ' &hh#124; '); // prevent converting "\|" again
fs.writeFileSync("main.html", escapedContent, 'utf-8');
const initMarkdown = turndownService.turndown(fs.readFileSync("main.html", "utf8"));
const markdown = initMarkdown.replace(/&hh#124;/gi, '&#124;'); // convert back to "&#124;" 
fs.writeFileSync(process.argv[2].slice(0,-4)+"md", markdown);
console.log("Markdown file created successfully!");
