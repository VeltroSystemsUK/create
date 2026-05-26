var http = require("http");
var fs = require("fs");
var path = require("path");
var port = 8899;
var root = __dirname;

var mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

http
  .createServer(function (req, res) {
    var url = req.url.split("?")[0];
    if (url === "/") url = "/framework-builder.html";
    var filePath = path.join(root, url);
    if (url.endsWith("/")) filePath = path.join(filePath, "index.html");
    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      var ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": mime[ext] || "text/plain" });
      res.end(data);
    });
  })
  .listen(port, function () {
    console.log("Framework + Animator on http://localhost:" + port);
    console.log("Animator: http://localhost:" + port + "/animator/");
  });
