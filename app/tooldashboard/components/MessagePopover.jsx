// components/navbar/MessagePopover.jsx
import {
  Popover,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const MessagePopover = ({ anchorEl, onClose }) => {
  const open = Boolean(anchorEl);
  const id = open ? "message-popover" : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Box sx={{ p: 2, width: 300 }}>
        <Typography variant="h6" gutterBottom>
          Xabarlar
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Salom, qanday?"
              secondary="Ali - 1 daqiqa oldin"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Buyumimni topshirdim"
              secondary="Vali - 5 daqiqa oldin"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Yordam bera olasizmi?"
              secondary="Nodira - 15 daqiqa oldin"
            />
          </ListItem>
        </List>
      </Box>
    </Popover>
  );
};

export default MessagePopover;
