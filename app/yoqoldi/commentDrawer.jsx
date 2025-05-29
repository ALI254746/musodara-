"use client";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useState } from "react";
import { useEffect } from "react";

// `CommentDrawer` uchun propslar
const CommentDrawer = ({
  open,
  onClose,
  onSubmit,
  currentItemId,
  commentsData = {},
  fetchComments,
}) => {
  const [newCommentText, setNewCommentText] = useState("");
  // ⛳ MUHIM: commentlarni drawer ochilganida yuklash
  useEffect(() => {
    if (open && currentItemId && fetchComments) {
      fetchComments(currentItemId);
    }
  }, [open, currentItemId, fetchComments]);
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    onSubmit(newCommentText); // yuqoridan kelgan `onSubmit` function
    setNewCommentText("");
  };
  const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (seconds < 60) return `${seconds} soniya oldin`;
    if (minutes < 60) return `${minutes} daqiqa oldin`;
    if (hours < 24) return `${hours} soat oldin`;
    return `${days} kun oldin`;
  };
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: "60vh",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 3,
          backgroundColor: "#fafafa",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Izohlar
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ overflowY: "auto", maxHeight: "calc(60vh - 160px)", mb: 2 }}>
        {currentItemId && commentsData[currentItemId]?.length > 0 ? (
          commentsData[currentItemId].map((comment) => (
            <Box
              key={comment.id || comment._id}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <Avatar
                src={comment.userId?.avatar}
                alt={comment.userId?.name}
                sx={{ mr: 2 }}
              ></Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {comment.userId?.name || "Foydalanuvchi"}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  {comment.text}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  {timeAgo(comment.updatedAt)}
                </Typography>
              </Box>
              <IconButton onClick={() => handleLikeComment(comment.id)}>
                <ThumbUpIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            Hozircha izohlar yo'q.
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Izoh yozing..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddComment}>
          Yuborish
        </Button>
      </Box>
    </Drawer>
  );
};

export default CommentDrawer;
