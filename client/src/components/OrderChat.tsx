import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { getOrderComments, createOrderComment } from '../services/api';
import { format } from 'date-fns';

interface OrderComment {
  id: number;
  order_id: number;
  user_id: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user_email: string;
  user_full_name: string;
}

interface OrderChatProps {
  orderId: number;
  currentUserEmail: string;
  isAdmin?: boolean;
}

const OrderChat: React.FC<OrderChatProps> = ({ orderId, currentUserEmail, isAdmin = false }) => {
  const [comments, setComments] = useState<OrderComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchComments();
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const fetchComments = async () => {
    try {
      const data = await getOrderComments(orderId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const comment = await createOrderComment({
        order_id: orderId,
        comment: newComment.trim(),
      });
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const isCurrentUser = (email: string) => email === currentUserEmail;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isAdmin ? 'Чат с клиентом' : 'Чат с администратором'}
      </Typography>
      <Paper
        elevation={3}
        sx={{
          height: 400,
          overflow: 'auto',
          mb: 2,
          p: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        <List>
          {comments.map((comment) => (
            <React.Fragment key={comment.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  flexDirection: 'column',
                  alignItems: isCurrentUser(comment.user_email) ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    backgroundColor: isCurrentUser(comment.user_email)
                      ? isAdmin
                        ? '#e8f5e9' // Light green for admin messages
                        : '#e3f2fd' // Light blue for user messages
                      : isAdmin
                        ? '#e3f2fd' // Light blue for user messages in admin view
                        : '#e8f5e9', // Light green for admin messages in user view
                    borderRadius: 2,
                    p: 1,
                    position: 'relative',
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {comment.user_full_name || comment.user_email}
                    {isAdmin && !isCurrentUser(comment.user_email) && ' (Клиент)'}
                    {isAdmin && isCurrentUser(comment.user_email) && ' (Администратор)'}
                  </Typography>
                  <Typography variant="body1">{comment.comment}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(comment.created_at), 'MMM d, yyyy HH:mm')}
                  </Typography>
                </Box>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder={isAdmin ? "Напишите сообщение клиенту..." : "Напишите сообщение администратору..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !newComment.trim()}
            sx={{ alignSelf: 'flex-end' }}
          >
            Отправить
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default OrderChat; 