const fs = require("fs");
const http = require("http");
const url = require("url");

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
const ReplaceTemplate = function (temp, product) {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};
// Create an HTTP server
const server = http.createServer((req, res) => {
  // Get the requested URL path
  let PathName = req.url;

  // Handle different routes based on the URL
  if (PathName === "/" || PathName === "/overview") {
    // Serve the overview page
    res.writeHead(200, { "Content-type": "text/html" });
    const CardHtml = DataApi.map((product) =>
      ReplaceTemplate(TempCard, product)
    ).join("");
    let Output = TempOverview.replace(/{%PRODUCT_CARDS%}/g, CardHtml);
    res.end(Output);
  } else if (PathName === "/product") {
    // Serve a product-related response
    res.end("this is the product route");
  } else if (PathName === "/api") {
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
