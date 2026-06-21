require("dotenv").config();

const dns =require("dns");
dns.setServers(["8.8.8.8" , "1.1.1.1"]);

const http = require("http");
const app = require("./app.js");

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});

