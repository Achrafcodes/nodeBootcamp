const fs = require("fs");
// // blocking ,synchronous way
// const text = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(text);
// const TextOut = `this is the avocado ${text}.\n Created in ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", TextOut);
// console.log("writen");

// non-blocking  asynchronouse way
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
  if (err) return console.log("error");
  fs.readFile(`./txt/${data}.txt`, "utf-8", (err, dataw) => {
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      fs.writeFile(
        "./txt/final.txt",
        `${dataw} \n ${data3}`,
        "utf-8",
        (err) => {
          console.log("yourfile has been writing");
        }
      );
    });
  });
});
