const socket = io();
var chat = document.getElementById('msgs');

socket.on("message", (message) => {
  console.log(message);
  
});

socket.on("store", (message) => {
  console.log(message);
});

// Update dom of cuurent client without socket
var btn = document.getElementById('btn');
var textContent = document.getElementById('msg');
var search = document.getElementById('search');
btn.addEventListener('click', ()=>{
  // console.log(textContent.value);
  socket.emit("message", textContent.value);
  
  textContent.value = "";
});
// emit message for other clients



var typedMessage;

