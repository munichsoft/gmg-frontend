import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
}

interface Message {
  text?: string;
  imageUrl?: string;
  sender: 'user' | 'seller';
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, sellerName }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: `Hi, I'm interested in your listing. Is it still available?`, sender: 'user' },
    { text: `Hello! Thanks for your interest. Yes, it is still available.`, sender: 'seller' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
    // Cleanup Object URLs on component unmount
    return () => {
      messages.forEach(message => {
        if (message.imageUrl && message.imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(message.imageUrl);
        }
      });
    };
  }, [isOpen, messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage: Message = { text: newMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate seller's reply after a short delay
    setTimeout(() => {
      const sellerReply: Message = { text: 'Thanks for your message! I will get back to you shortly.', sender: 'seller' };
      setMessages(prev => [...prev, sellerReply]);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const imageMessage: Message = { imageUrl, sender: 'user' };
      setMessages(prev => [...prev, imageMessage]);

      // Simulate seller's reply
      setTimeout(() => {
        const sellerReply: Message = { text: 'Got the image, thanks! Looking at it now.', sender: 'seller' };
        setMessages(prev => [...prev, sellerReply]);
      }, 1500);
    }
    // Reset file input value to allow selecting the same file again
    if (e.target) {
        e.target.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative flex flex-col h-[80vh] max-h-[600px]" onClick={e => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Message {sellerName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close message modal">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>
        <div className="p-6 flex-grow overflow-y-auto flex flex-col space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              <div className={`p-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-brand-saffron text-white' : 'bg-gray-600 text-white'}`}>
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Uploaded by user" className="rounded-md max-h-48" />
                )}
                {msg.text && (
                  <p className="px-1 py-1">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              aria-hidden="true"
            />
            <button type="button" onClick={triggerFileUpload} className="text-gray-500 hover:text-brand-saffron p-2 rounded-full transition-colors" aria-label="Attach image">
                <PhotoIcon className="h-6 w-6" />
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-brand-saffron focus:border-brand-saffron"
              aria-label="Message input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="bg-brand-saffron text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition disabled:opacity-50" disabled={!newMessage.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;