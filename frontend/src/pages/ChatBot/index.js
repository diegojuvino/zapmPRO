import React, { useEffect, useReducer, useState , useContext} from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/Auth/AuthContext";
import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { DeleteOutline, Edit } from "@material-ui/icons";
import QueueModal from "../../components/QueueModal";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import { socketConnection } from "../../services/socket";
import { Stack, Typography } from "@mui/material";
import ChatBotModal from "../../components/ChatBotModal";

const useStyles = makeStyles(theme => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    borderRadius: "10px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
    ...theme.scrollbarStyles
  },
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const reducer = (state, action) => {
  if (action.type === "LOAD_QUEUES") {
    const queues = action.payload;
    const newQueues = [];

    queues.forEach(queue => {
      const queueIndex = state.findIndex(q => q.id === queue.id);
      if (queueIndex !== -1) {
        state[queueIndex] = queue;
      } else {
        newQueues.push(queue);
      }
    });

    return [...state, ...newQueues];
  }

  if (action.type === "UPDATE_QUEUES") {
    const queue = action.payload;
    const queueIndex = state.findIndex(u => u.id === queue.id);

    if (queueIndex !== -1) {
      state[queueIndex] = queue;
      return [...state];
    } else {
      return [queue, ...state];
    }
  }

  if (action.type === "DELETE_QUEUE") {
    const queueId = action.payload;
    const queueIndex = state.findIndex(q => q.id === queueId);
    if (queueIndex !== -1) {
      state.splice(queueIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const ChatBot = () => {
  const classes = useStyles();

  const [queues, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);

  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const history = useHistory();
  if(user.profile !== "admin"){
    history.push("/tickets")
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/queue");
        dispatch({ type: "LOAD_QUEUES", payload: data });

        setLoading(false);
      } catch (err) {
        toastError(err);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketConnection({ companyId });

    socket.on(`company-${companyId}-queue`, data => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUEUES", payload: data.queue });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_QUEUE", payload: data.queueId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenQueueModal = () => {
    setQueueModalOpen(true);
    setSelectedQueue(null);
  };

  const handleCloseQueueModal = () => {
    setQueueModalOpen(false);
    setSelectedQueue(null);
  };

  const handleEditQueue = queue => {
    setSelectedQueue(queue);
    setQueueModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedQueue(null);
  };

  const handleDeleteQueue = async queueId => {
    try {
      await api.delete(`/queue/${queueId}`);
      toast.success(i18n.t("Queue deleted successfully!"));
    } catch (err) {
      toastError(err);
    }
    setSelectedQueue(null);
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          selectedQueue &&
          `${i18n.t("queues.confirmationModal.deleteTitle")} ${
            selectedQueue?.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteQueue(selectedQueue.id)}
      >
        {i18n.t("queues.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <ChatBotModal
        open={queueModalOpen}
        onClose={handleCloseQueueModal}
        queueId={selectedQueue?.id}
      />
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
              {i18n.t("queues.title")}
            </Typography>
            <Typography
              style={{ marginTop: "-10px", marginLeft: "10px" }}
              variant="caption"
              color="textSecondary"
            >
              Crie filas de atendimento para seus clientes.
            </Typography>
          </Stack>

          <MainHeaderButtonsWrapper>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenQueueModal}
            >
              {i18n.t("Novo Chat Bot")}
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
            <Table size="small">
              <TableHead
                style={{
                  backgroundColor: "#3d3d3d",
                  color: "#fff",
                  borderRadius: "5px"
                }}
              >
                <TableRow>
                  <TableCell style={{ color: "#fff" }} align="center">
                    {i18n.t("queues.table.name")}
                  </TableCell>
                  <TableCell style={{ color: "#fff" }} align="center">
                    {i18n.t("Fila")}
                  </TableCell>

                  <TableCell style={{ color: "#fff" }} align="center">
                    {i18n.t("queues.table.actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <>
                  {queues.map(queue => (
                    <TableRow key={queue.id}>
                      <TableCell align="center">{queue?.name}</TableCell>
                      <TableCell align="center">
                        <div className={classes.customTableCell}>
                          <span
                            style={{
                              backgroundColor: queue.color,
                              width: 60,
                              height: 20,
                              alignSelf: "center"
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className={classes.customTableCell}>
                          <Typography
                            style={{ width: 300, align: "center" }}
                            noWrap
                            variant="body2"
                          >
                            {queue.greetingMessage}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEditQueue(queue)}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedQueue(queue);
                            setConfirmModalOpen(true);
                          }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {loading && <TableRowSkeleton columns={4} />}
                </>
              </TableBody>
            </Table>
          </Paper>
        </Stack>
      </Paper>
    </MainContainer>
  );
};

export default ChatBot;
