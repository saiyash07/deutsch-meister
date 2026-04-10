import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';

export default function Layout({ progress, setApiKey, setChatHistory }) {
  return (
    <div className="app-layout">
      <Sidebar streak={progress.currentStreak} />
      <main className="main-content">
        <Outlet />
      </main>
      <ChatBot 
        apiKey={progress.apiKey} 
        chatHistory={progress.chatHistory}
        setChatHistory={setChatHistory}
      />
    </div>
  );
}
