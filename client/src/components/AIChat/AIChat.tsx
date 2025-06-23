import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, TextField, Typography, Paper, useTheme } from '@mui/material';
import { Send, X, MessageSquare } from 'react-feather';
import { styled } from '@mui/material/styles';
import { useApiStore } from '../../stores/apiStore';

// Add this for Vite env typing
interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const ChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  width: 350,
  height: 500,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  zIndex: 1000,
  overflow: 'hidden',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  backgroundColor: theme.palette.background.default,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
  },
}));

const MessageBubble = styled(Box)<{ isUser: boolean }>(({ theme, isUser }) => ({
  maxWidth: '80%',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: isUser 
    ? theme.palette.primary.main 
    : theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(0, 0, 0, 0.08)',
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  wordBreak: 'break-word',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const MinimizedChat = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  width: 50,
  height: 50,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '50%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

interface Message {
  text: string;
  isUser: boolean;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    text: 'Привет! Я эхо-бот. Я просто повторю то, что вы мне напишете.',
    isUser: false
  }]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { products, categories, manufacturers, fetchProducts, fetchCategories, fetchManufacturers } = useApiStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    fetchProducts();
    fetchCategories();
    fetchManufacturers();
    // eslint-disable-next-line
  }, []);

  // Utility to build a prompt for GPT
  function buildPrompt(userMessage: string) {
    // Compose a context for GPT: product list, categories, manufacturers
    const productList = products.slice(0, 30).map(p => {
      const cat = p.category?.name || categories.find(c => c.id === p.category_id)?.name || '';
      const man = p.manufacturer?.name || manufacturers.find(m => m.id === p.manufacturer_id)?.name || '';
      return `${p.name} | категория: ${cat} | производитель: ${man} | цена: ${p.price} | описание: ${p.description}`;
    }).join('\n');
    const systemPrompt = `Ты — ассистент интернет-магазина семян. Вот список товаров (до 30):\n${productList}\n\nЕсли пользователь спрашивает о товаре или фильтрах (например, \'лук немецкий дешевле 5 рублей\'), найди подходящие товары и выведи их в виде списка: название, категория, производитель, цена. Если ничего не найдено — скажи об этом. Если вопрос не о товарах — просто ответь как ассистент сайта. Всегда отвечай на русском языке.`;
    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];
  }

  async function askGpt(messagesArr: { role: string, content: string }[]) {
    setLoading(true);
    setError(null);
    try {
      // @ts-ignore
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messagesArr,
          temperature: 0.2,
          max_tokens: 500,
        }),
      });
      if (!response.ok) throw new Error('Ошибка OpenAI API');
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (e: any) {
      setError(e.message || 'Ошибка общения с AI');
      return null;
    } finally {
      setLoading(false);
    }
  }

  const handleSend = async () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { text: input, isUser: true }]);
      const userMessage = input;
      setInput('');
      setLoading(true);
      const prompt = buildPrompt(userMessage);
      const aiReply = await askGpt(prompt);
      if (aiReply) {
        setMessages(prev => [...prev, { text: aiReply, isUser: false }]);
      } else if (error) {
        setMessages(prev => [...prev, { text: `Ошибка: ${error}`, isUser: false }]);
      }
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <MinimizedChat onClick={() => setIsMinimized(false)}>
        <MessageSquare size={24} />
      </MinimizedChat>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>
          Эхо-бот
        </Typography>
        <IconButton 
          size="small" 
          onClick={() => setIsMinimized(true)}
          sx={{ 
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <X size={18} />
        </IconButton>
      </ChatHeader>

      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageBubble key={index} isUser={message.isUser}>
            <Typography variant="body1">{message.text}</Typography>
          </MessageBubble>
        ))}
        {loading && (
          <MessageBubble isUser={false}>
            <Typography variant="body2" color="text.secondary">AI думает...</Typography>
          </MessageBubble>
        )}
        {error && (
          <MessageBubble isUser={false}>
            <Typography variant="body2" color="error.main">{error}</Typography>
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Введите сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              borderRadius: 2,
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
        <IconButton 
          onClick={handleSend}
          disabled={!input.trim()}
          color="primary"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <Send size={20} />
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default AIChat; 