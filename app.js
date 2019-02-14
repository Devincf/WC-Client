let button,text,chat;

let username;

let websocket;

const split_string = ";";

function addMessage(username,date,msg){
   chat.innerText += date + "    " + username + " : " + msg + "\r\n";
}

function makeid() {
   var text = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
   for (var i = 0; i < 5; i++)
     text += possible.charAt(Math.floor(Math.random() * possible.length));
 
   return text;
 }

window.onload = function(){
    button = document.querySelector("#sendButton");
    text = document.querySelector("#textbox");
    chat = document.querySelector("#chatbox");

    username = makeid();

    button.onclick = function(){
       alert("not connected to websocket");
    }

    if ("WebSocket" in window) {        
        // Let us open a web socket
        websocket = new WebSocket("ws://localhost:7676");
         
         websocket.onopen = function() {
            chat.innerText += "Connected to Chat as " + username + "\r\n\n";

            button.onclick = function(){
               date = new Date();
               dateString = "";
               dateString += ((date.getDate() <10)? "0" : "") + date.getDate() + ".";
               dateString += ((date.getMonth() <10)? "0" : "") + (date.getMonth()+1) + ".";
               dateString += date.getFullYear() + " ";
               dateString += date.getHours() + ":";
               dateString += ((date.getMinutes() <10)? "0" : "") + date.getMinutes();
               msg = text.value;
               //       opcode   msglen   msg   date        username
               message = ["0", msg.length, msg, dateString, username];
               let test = "";
               for (let i = 0; i < message.length; i++) {
                  test += message[i];
                  test += split_string;
              }
               console.log(test);
               websocket.send(test);
          }
         };
         
        websocket.onmessage = function (evt) { 
           var received_msg = evt.data;
           const split = received_msg.split(split_string);
           if(split[0] == 0){
               const len = split[1];
               let msg = "";
               let i = 2;
               while(msg.length<len){
                  if(i>2) 
                     msg += split_string;
                  msg += split[i++];
               }
               const date = split[i++];
               const username = split[i];
               addMessage(username,date,msg);
           }
        };
         
        websocket.onclose = function() { 
        };
     } else {
        // The browser doesn't support WebSocket
        alert("WebSocket NOT supported by your Browser!");
     }

}