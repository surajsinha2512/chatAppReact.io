import './App.css';
import {useState,useEffect} from 'react';
import io from "socket.io-client";
const socket= io("http://localhost:9999/");
function App() {
  const [messages,setMessages]=useState([]);
  const [chat,setChat]=useState("");
  const [name,setName]=useState("");
  const sendChat= ()=>{
    sendChatToServer(chat)
  }
  const storeInput=(e)=>{
    setChat(e.target.value);
  }

  const sendOnEnter = e =>{
    if(e.keyCode===13)
    sendChatToServer(chat)
  }
  const sendChatToServer =(msg)=>{
    if(msg.trim()!==""){
  socket.emit('mySocketEndPoint', {user:name,value:msg})
      setChat("");
    }
  }

 // const addMessage=msg=>{
  //  setMessages([...messages,msg]);
 // }

useEffect(()=>{
 fetch("http://localhost:9999/history").then(r=>r.json()).then((msg)=>{
   setMessages(msg)
   console.log(msg)
 }).then(()=>{
  console.log(messages)
const inputName=prompt("enter your name");
setName(inputName);
socket.emit("Introduction",{user:inputName});

socket.on('myBroadCast',(msg)=> {
  setMessages(m=>[...m,msg])
  console.log('myBroadCast');
  console.log(messages)
});
 

/// intro broadcast 
socket.on('broadcastIntro',(msg)=> {
 //addMessage(msg);
 setMessages(m=>[...m,msg]);
 console.log('broadcastIntro')
});



 })
},[]);



  return (
    <div className="App">
      <div id="name"></div>
      <ul id="messages">{messages.map((msg,idx)=>{
      <li>
       <b>`${msg.name}</b>  ${msg.txt}` 
      </li>
      })}</ul>
      <div  id="form" onKeyPress={sendOnEnter}>
      <input id="input" onChange={storeInput} autoComplete="off" value={chat}/>
      <button onClick={sendChat}>Send</button>
      </div>
    </div>
  );
}

export default App;
