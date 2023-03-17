var Username = document.getElementById("usr");
var Message = document.getElementById("msg");

var Chat = document.getElementById("chat_display");

var socket_server = new WebSocket("ws://localhost:3031");

socket_server.onmessage = async (event) => {
    Chat.innerHTML = await new Response(event.data).text();
}

setInterval(() => {
    socket_server.send("RequestLogs");
}, 1000);

function send() {
    socket_server.send(Username.value + ": " + Message.value + "<br>");
}