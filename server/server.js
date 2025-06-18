import fs from "fs";
import http from "http";
import url from "url";

//for cors headers
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;

  if (method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (method === "POST" && pathname === "/api/feedback") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString(); // Convert Buffer to string
    });

    req.on("end", () => {
      try {
        const { name, message } = JSON.parse(body);
        if (!name || !message) {
          res.writeHead(400, headers);
          res.end(JSON.stringify({ error: "All fields are required" }));
          return;
        }

        let data = [];
        try {
          const fileData = fs.readFileSync("feedback.json", "utf8");
          data = JSON.parse(fileData);
        } catch (error) {
          data = [];
        }
        
        data.push({ name, message, date: new Date().toISOString() });
        fs.writeFileSync("feedback.json", JSON.stringify(data, null, 2));

        res.writeHead(200, headers);
        res.end(JSON.stringify({ message: "Feedback saved successfully" }));
      } catch (error) {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
        return;
      }
    }); 
  } else if (method === "GET" && pathname === "/api/feedback") {
    const fileData = fs.readFileSync("feedback.json", "utf8");
    res.writeHead(200, headers);
    res.end(fileData);
  } else{
    res.writeHead(404, headers);
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
