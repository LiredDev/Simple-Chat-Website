const http = require("http");
const ws = require("ws");
const fs = require("fs");

const PAGES_DIRECTORY = "./Pages";

let server = http.createServer((req, res) => {
    var url = req.url;

    if (url.endsWith(".html")) {
        res.writeHead(200, "Content-Type: text/html");
    } else if (url.endsWith(".css")) {
        res.writeHead(200, "Content-Type: text/css");
    } else if (url.endsWith(".js")) {
        res.writeHead(200, "Content-Type: text/javascript");
    }

    fs.readFile(PAGES_DIRECTORY + url, (err, data) => {
        if (err) {
            res.write("Unable to find the page you're looking for");
            res.end();
            return;
        }
        res.write(data);
        res.end();
    });
});

let socket = new ws.Server({ port: 3031 });

socket.on("connection", (client) => {
    client.on("message", (msg) => {

        var str_msg = msg.toString();

        if (str_msg == "RequestLogs") {

            fs.readFile("./Logs/ChatLogs.txt", (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                client.send(data);
            });

        } else {

            var chat_logs = "";

            fs.readFile("./Logs/ChatLogs.txt", (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                chat_logs = data;
                fs.writeFile("./Logs/ChatLogs.txt", chat_logs + str_msg, (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
            });

            client.send(chat_logs + str_msg);
        }
    });
});

server.listen(3030, () => {
    console.log("Server listening on port 3030");
    console.log("Url: http://localhost:3030");
});