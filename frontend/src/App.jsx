// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


// import LegalChatbot from './components/LegalChatbot';

// function App() {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Website Luật sư AI</h1>
//       <p>Đây là nội dung chính của website.</p>

//       <LegalChatbot />
//     </div>
//   );
// }

// export default App;

import { useState } from 'react';
import LegalChatbot from './components/LegalChatbot';
import './App.css';

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    // <div className="App">
    //   <button className="chat-toggle" onClick={() => setShowChat(!showChat)}>
    //     {showChat ? '✖' : 'Luật sư AI'}
    //   </button>

    //   {showChat && <LegalChatbot />}
    // </div>
    <>
      <div className="announcement">
        <h1>🚧 Hệ thống chưa hoàn thiện</h1>
        <p>Chúng tôi đang trong quá trình phát triển và cải tiến. Cảm ơn bạn đã kiên nhẫn!</p>
      </div>
      {!showChat && (
        <button
          className="open-chat-btn"
          onClick={() => setShowChat(true)}
        >
          Luật sư AI
        </button>
      )}

      {showChat && (
        <LegalChatbot onClose={() => setShowChat(false)} />
      )}
    </>
  );
}

export default App;
