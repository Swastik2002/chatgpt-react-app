// import './App.css';
// import React, { useState } from 'react';
// // import ChatComponent from './ChatComponent';
// import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
// import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

// const API_KEY = "second api key";

// function App() {

//   const [typing, setTyping] = useState(false);

//   const [messages, setMessages] = useState([
//     {
//       message: "Hello, I am ChatGPT",
//       sender: "ChatGPT",
//       direction: "incoming"
//     }
//   ])

//   const handleSend = async (message) => {
//     const newMessage = {
//       message: message, 
//       sender: "user",
//       direction: "outgoing"
//     }
  
//     const newMessages = [...messages, newMessage];

//     setMessages(newMessages);

//     setTyping(true);

//     await processMessageToChatGPT(newMessages);
//   }

//   async function processMessageToChatGPT(chatMessages) {
//     let apiMesaages = chatMessages.map((messageObject) => {
//       let role = "";
//       if(messageObject.sender === "ChatGPT") {
//         role = "assistant"
//       } else {
//         role = "user"
//       }
//       return {role: role, content: messageObject.message}
//     });

//     const systemMessage = {
//       role: "system", 
//       content: "Explain all concepts like a teacher."
//     }

//     const apiRequestBody = {
//       "model": "gpt-3.5-turbo", 
//       "messages": [
//         systemMessage,
//         ...apiMesaages 
//       ]
//     }

//     await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST", 
//       headers: {
//         "Authorization" : "Bearer " + API_KEY,
//         "Content-Type" : "application/json" 
//       },
//       body: JSON.stringify(apiRequestBody)
//     }).then((data) => {
//       return data.json();
//     }).then((data) => {
//       console.log(data);
//       // console.log(data.choices[0].message.content);
//       // setMessages(
//       //   [...chatMessages, {
//       //     message: data.choices[0].message.content,
//       //     sender: "ChatGPT"
//       //   }]
//       // )
//       // setTyping(false);
//     });
//   }
  

//   return (
//     <div className="App">
//       <h1>ChatGPT</h1>
//       <div style={{position: "relative", marginLeft: "20%", height: "500px", width: "700px"}}>
//           <MainContainer>
//             <ChatContainer>
//               <MessageList scrollBehavior="smooth" typingIndicator={typing? <TypingIndicator content="ChatGPT is typing"/> : null}>
//                 {messages.map((message, i) => {
//                   return <Message key={i} model={message}/>
//                 })}
//               </MessageList>
//               <MessageInput placeholder='Type Message here' onSend={handleSend}/>
//             </ChatContainer>
//           </MainContainer>
//           {/* <h1>React ChatGPT Integration</h1>
//           <ChatComponent/> */}
//       </div>
//     </div>
//   );
// };

// export default App;




import './App.css';
import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';


const API_KEY = "";
const MAX_RETRIES = 5; // Maximum number of retries

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages, 0); // Start with 0 retries
  };

  async function processMessageToChatGPT(chatMessages, retryCount) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like a teacher."
    };

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      if (response.status === 429) {
        if (retryCount < MAX_RETRIES) {
          console.log('Rate limit exceeded. Retrying after a delay...'+ MAX_RETRIES +" retryCount"+ retryCount);
          setTimeout(() => processMessageToChatGPT(chatMessages, retryCount + 1), 10000); // Retry after 10 seconds
        } else {
          console.error('Max retries exceeded. Please try again later.');
          setTyping(false);
        }
        return;
      }

      const data = await response.json();
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT",
        direction: "incoming"
      }]);
      setTyping(false);
    } catch (error) {
      console.error('Error fetching completion:', error);
      setTyping(false);
    }
  }

  return (
    <div className="App">
      <h1>ChatGPT</h1>
      <div style={{ position: "relative", marginLeft: "20%", height: "500px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList scrollBehavior="smooth" typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null}>
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder='Type Message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;