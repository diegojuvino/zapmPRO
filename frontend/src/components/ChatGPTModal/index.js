import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { i18n } from "../../translate/i18n";
import { Box, Divider, Input } from "@material-ui/core";
import { generateMessage } from "./helper";

const ChatGPTModal = ({ title, open, onClose }) => {
  const [resultMessage, setResultMessages] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const myText = e.target.value;
    setText(myText);
  };

  const handleChatGpt = async event => {
    setLoading(true);

    await generateMessage(text)
      .then(response => {
        setLoading(false);
        //console.log(response,"minha response")
        setResultMessages(response.choices[0].message.content);
      })
      .catch(error => {
        //console.log(error);
      });
  };

  const handleClose = () => {
    onClose();
    setLoading(false);
    setText("");
    setResultMessages(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-dialog"
      fullWidth
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent dividers>
        <Input
          multiline
          type="text"
          value={text || ""}
          onChange={handleChange}
          minRows={4}
          placeholder="Descreva as características da campanha. Ex: 'Escreva uma mensagem sobre promoção de supermercado.' "
          fullWidth
        ></Input>
        <Button
          variant="contained"
          onClick={handleChatGpt}
          style={{ marginTop: 10 }}
        >
          Gerar mensagem
        </Button>
        {loading && !resultMessage && (
          <Box
            sx={{
              display: "flex",
              marginTop: 30,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <CircularProgress />
            <Typography variant="body1" style={{ marginLeft: 10 }}>
              Processando...
            </Typography>
          </Box>
        )}

        {resultMessage && !loading && (
          <Box>
            <Divider style={{ marginTop: 20 }}></Divider>
            <Typography variant="body1" style={{ marginTop: 20 }}>
              Mensagem gerada:
            </Typography>
            <Input multiline type="text" fullWidth value={resultMessage} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => onClose(false)}
          color="default"
        >
          {i18n.t("confirmationModal.buttons.cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onClose(false);
          }}
          color="secondary"
        >
          {i18n.t("confirmationModal.buttons.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatGPTModal;
