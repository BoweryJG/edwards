import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Chip,
  CircularProgress,
  Fade,
  Slide,
  Avatar,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  AutoAwesome as SparkleIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '../store/chatStore';
import { FinancingWidget } from './FinancingWidget';

interface ChatbotProps {
  onClose?: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const {
    isOpen,
    isLoading,
    messages,
    bookingIntent,
    suggestedResponses,
    showFinancingWidget,
    financingProcedure,
    toggleChat,
    sendMessage,
    setShowFinancingWidget
  } = useChatStore();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const message = input.trim();
      setInput('');
      await sendMessage(message);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleSuggestedResponse = (response: string) => {
    setInput(response);
    inputRef.current?.focus();
  };
  
  
  return (
    <>
      {/* Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={10}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: { xs: '90vw', sm: 400 },
            height: { xs: '80vh', sm: 600 },
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Enhanced Header */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  width: 48,
                  height: 48,
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              >
                <Typography fontSize="1.8rem">👩‍⚕️</Typography>
              </Avatar>
              <Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography variant="h6" fontWeight="bold">
                    Sophie
                  </Typography>
                  <SparkleIcon sx={{ fontSize: 16, color: '#FFD700' }} />
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    opacity: 0.9,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Box 
                    component="span" 
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#4CAF50',
                      display: 'inline-block',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                  Active Now • Smile Specialist
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={() => {
                toggleChat();
                onClose?.();
              }} 
              sx={{ 
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Enhanced Stage Indicator */}
          <Box sx={{ px: 2, py: 1.5, bgcolor: 'grey.50' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  Journey Progress
                </Typography>
                {bookingIntent > 60 && (
                  <OfferIcon sx={{ fontSize: 14, color: '#4CAF50' }} />
                )}
              </Box>
              <Typography variant="caption" color="primary" fontWeight="bold">
                {bookingIntent}% Ready to Book
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={bookingIntent} 
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: bookingIntent > 80 
                    ? 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)'
                    : bookingIntent > 50
                    ? 'linear-gradient(90deg, #2196F3 0%, #03A9F4 100%)'
                    : 'linear-gradient(90deg, #9C27B0 0%, #E91E63 100%)',
                }
              }}
            />
          </Box>
          
          {/* Messages or Financing Widget */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {showFinancingWidget && financingProcedure ? (
              <FinancingWidget
                procedureType={financingProcedure}
                procedureCost={
                  financingProcedure === 'yomi' ? 5000 :
                  financingProcedure === 'tmj' ? 2500 :
                  3200
                }
                onComplete={(_result) => {
                  setShowFinancingWidget(false);
                  sendMessage('I completed the financing/insurance check');
                }}
              />
            ) : (
              <>
            {messages.map((message) => (
              <Fade in key={message.id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                    gap: 1
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                      width: 36,
                      height: 36,
                      border: message.role === 'assistant' ? '2px solid #e0e0e0' : 'none'
                    }}
                  >
                    {message.role === 'user' ? (
                      <PersonIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <Typography fontSize="1.2rem">👩‍⚕️</Typography>
                    )}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100',
                      color: message.role === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 8,
                        [message.role === 'user' ? 'right' : 'left']: -6,
                        width: 0,
                        height: 0,
                        borderStyle: 'solid',
                        borderWidth: '6px 6px 6px 0',
                        borderColor: `transparent ${
                          message.role === 'user' ? '#42a5f5' : '#f5f5f5'
                        } transparent transparent`,
                        transform: message.role === 'user' ? 'rotate(180deg)' : 'none'
                      }
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </Paper>
                </Box>
              </Fade>
            ))}
            
            {isLoading && (
              <Box display="flex" gap={1} alignItems="center">
                <Avatar 
                  sx={{ 
                    bgcolor: 'white',
                    width: 36,
                    height: 36,
                    border: '2px solid #e0e0e0'
                  }}
                >
                  <Typography fontSize="1.2rem">👩‍⚕️</Typography>
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box display="flex" gap={0.5}>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    >
                      <CircularProgress size={8} sx={{ color: 'primary.main' }} />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    >
                      <CircularProgress size={8} sx={{ color: 'primary.main' }} />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    >
                      <CircularProgress size={8} sx={{ color: 'primary.main' }} />
                    </motion.div>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontStyle="italic">
                    Sophie is thinking...
                  </Typography>
                </Paper>
              </Box>
            )}
              </>
            )}
            
            <div ref={messagesEndRef} />
          </Box>
          
          {/* Enhanced Suggested Responses */}
          {suggestedResponses.length > 0 && !isLoading && (
            <Box sx={{ px: 2, pb: 2, bgcolor: 'grey.50' }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ display: 'block', mb: 1 }}
              >
                Quick responses:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {suggestedResponses.map((response, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Chip
                      label={response}
                      onClick={() => handleSuggestedResponse(response)}
                      icon={
                        response.toLowerCase().includes('appointment') || 
                        response.toLowerCase().includes('book') 
                          ? <OfferIcon /> 
                          : <SparkleIcon />
                      }
                      sx={{
                        cursor: 'pointer',
                        borderColor: 'primary.light',
                        bgcolor: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>
          )}
          
          <Divider />
          
          {/* Input */}
          <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              inputRef={inputRef}
              multiline
              maxRows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark'
                },
                '&:disabled': {
                  bgcolor: 'grey.300'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};