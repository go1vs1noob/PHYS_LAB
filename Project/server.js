


//ПОКА НЕ УГЛУБЛЯЛСЯ В СЕРВЕР, НЕ ГРУЗИТ КАРТИНКИ. ЗАПУСКАТЬ ЧЕРЕЗ VS CODE


const http = require("http");
const fs = require("fs");

const html_file = fs.readFileSync("index.html", "utf-8");
const css_file = fs.readFileSync("style.css", "utf-8");
const js_file = fs.readFileSync("script.js", "utf-8");

http
  .createServer((req, res) => {
    //console.log(req.url);
    switch (req.url) {
      case "/":
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html_file);
        break;

      case "/style.css":
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(css_file);
        break;

      case "/ script.js":
        res.writeHead(200, { "Content-Type": "text/javascript" });
        res.end(js_file);
        break;

      default:
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404");
        break;
    }

    // res.writeHead(200, {'Content-Type': 'text/html' } );
    // res.end(html_file);
  })
  .listen(3000, () => console.log("server is working"));
