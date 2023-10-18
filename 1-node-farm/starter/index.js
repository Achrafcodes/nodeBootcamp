const fs = require("fs");
const http = require("http");
const url = require("url");
const ReplaceTemplate = require("./modules/ReplaceTemplate");
const slugify = require("slugify");

//? Files

// // blocking ,synchronous way
// const text = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(text);
// const TextOut = `this is the avocado ${text}.\n Created in ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", TextOut);
// console.log("writen");

// non-blocking  asynchronouse way
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   if (err) return console.log("error");
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, dataw) => {
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       fs.writeFile(
//         "./txt/final.txt",
//         `${dataw} \n ${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("yourfile has been writing");
//         }
//       );
//     });
//   });
// });
//? Sever
// Read the template files and data from files
let TempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
let TempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
let TempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const Data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
let DataApi = JSON.parse(Data);
// Create an HTTP server
const server = http.createServer((req, res) => {
  // Get the requested URL path
  let { query, pathname } = url.parse(req.url, true);
  const Slug = DataApi.map((data) =>
    slugify(data.productName, { lower: true })
  );
  console.log(Slug);
  // Handle different routes based on the URL
  if (pathname === "/" || pathname === "/overview") {
    // Serve the overview page
    res.writeHead(200, { "Content-type": "text/html" });
    const CardHtml = DataApi.map((product) =>
      ReplaceTemplate(TempCard, product)
    ).join("");
    let Output = TempOverview.replace(/{%PRODUCT_CARDS%}/g, CardHtml);
    res.end(Output);
  } else if (pathname === "/product") {
    // Serve a product-related response
    let product = DataApi[query.id];
    let output = ReplaceTemplate(TempProduct, product);
    res.end(output);
    console.log("hello nodemon");
  } else if (pathname === "/api") {
    // Serve JSON data
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(Data);
  } else {
    // Handle 404 - Page not found
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello server",
    });
    res.end("<h1>Error: Page not found</h1>");
  }
});

// Start the server on port 8000 and IP address 127.0.0.1
server.listen(8000, "127.0.0.1", () => {
  console.log("Server listening on port 8000");
});
