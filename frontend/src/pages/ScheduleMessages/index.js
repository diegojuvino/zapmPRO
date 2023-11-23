import React, { useState, useEffect, useContext } from "react";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import { makeStyles, Button, Paper } from "@material-ui/core";

import ScheduleMessagesTable from "../../components/ScheduleMessagesTable";
import ScheduleMessageDialog from "../../components/ScheduleMessageDialog";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Stack, Typography } from "@mui/material";
import { i18n } from "../../translate/i18n";
import { toast } from "react-toastify";

import useScheduleMessages from "../../hooks/useScheduleMessages";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles(theme => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    borderRadius: "10px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
    ...theme.scrollbarStyles
  }
}));

function ScheduleMessages(props) {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageSelected, setMessageSelected] = useState({});
  const [showOnDeleteDialog, setShowOnDeleteDialog] = useState(false);

  const {
    list: listMessages,
    save: saveMessage,
    update: updateMessage,
    deleteRecord: deleteMessage
  } = useScheduleMessages();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      await loadingScheduleMessages();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadingScheduleMessages = async () => {
    setLoading(true);
    try {
      const companyId = localStorage.getItem("companyId");
      const messages = await listMessages({ companyId, userId: user.id });
      //console.log("messages", messages)
      setMessages(messages);
    } catch (e) {
      toast.error(e);
    }
    setLoading(false);
  };

  const handleOpenToAdd = () => {
    setModalOpen(true);
  };

  const handleOpenToEdit = message => {
    //console.log("handleOpenToEdit", message)
    setMessageSelected(message);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setMessageSelected({ id: null, message: "", shortcode: "" });
  };

  const handleSave = async message => {
    handleCloseModal();
    try {
      await saveMessage(message);
      await loadingScheduleMessages();
      toast.success("Messagem adicionada com sucesso.");
    } catch (e) {
      toast.error(e);
    }
  };

  const handleEdit = async message => {
    handleCloseModal();
    try {
      await updateMessage(message);
      await loadingScheduleMessages();
      toast.success("Messagem atualizada com sucesso.");
    } catch (e) {
      toast.error(e);
    }
  };

  const handleDelete = async message => {
    handleCloseModal();
    try {
      await deleteMessage(message.id);
      await loadingScheduleMessages();
      toast.success("Messagem excluída com sucesso.");
    } catch (e) {
      toast.error(e);
    }
  };



  return (
    <MainContainer>
      <Paper className={classes.mainPaper} variant="outlined">
        <MainHeader>
          <Stack>
            <Typography
              variant="h5"
              color="black"
              style={{
                fontWeight: "bold",
                marginLeft: "10px",
                marginTop: "10px"
              }}
              gutterBottom
            >
              {i18n.t("Mensagens de agendamento")}
            </Typography>
            <Typography
              style={{ marginTop: "-10px", marginLeft: "10px" }}
              variant="caption"
              color="textSecondary"
            >
              Crie mensagens rápidas para serem utilizadas nos agendamentos.
            </Typography>
          </Stack>
          <MainHeaderButtonsWrapper>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenToAdd}
            >
              {i18n.t("NOVA MENSAGEM")}
            </Button>
          </MainHeaderButtonsWrapper>
        </MainHeader>
        <Stack
          style={{
            padding: "20px",
            backgroundColor: "rgb(244 244 244 / 53%)",
            borderRadius: "5px",
            height: "93%"
          }}
        >
          <Paper>
            <ScheduleMessagesTable
              readOnly={false}
              messages={messages}
              showLoading={loading}
              editMessage={handleOpenToEdit}
              deleteMessage={message => {
                setMessageSelected(message);
                setShowOnDeleteDialog(true);
              }}
            />
          </Paper>
        </Stack>
      </Paper>
      <ScheduleMessageDialog
        messageSelected={messageSelected}
        modalOpen={modalOpen}
        onClose={handleCloseModal}
        editMessage={handleEdit}
        saveMessage={handleSave}
      />
      <ConfirmationModal
        title="Excluir Registro"
        open={showOnDeleteDialog}
        onClose={setShowOnDeleteDialog}
        onConfirm={async () => {
          await handleDelete(messageSelected);
        }}
      >
        Deseja realmente excluir este registro?
      </ConfirmationModal>
    </MainContainer>
  );
}

export default ScheduleMessages;
