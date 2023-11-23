import React, { useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import ColorPicker from "../ColorPicker";
import {
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
} from "@material-ui/core";
import { Colorize } from "@material-ui/icons";
import { QueueOptions } from "../QueueOptions";
import SchedulesForm from "../SchedulesForm";
import DnDFlow from "./components";
import { Box } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },

  btnWrapper: {
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  colorAdorment: {
    width: 20,
    height: 20,
  },
}));

const QueueSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  color: Yup.string().min(3, "Too Short!").max(9, "Too Long!").required(),
  greetingMessage: Yup.string(),
});

const ChatBotModal = ({ open, onClose, queueId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    color: "",
    greetingMessage: "",
    outOfHoursMessage: "",
  };

  const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
  const [queue, setQueue] = useState(initialState);
  const [tab, setTab] = useState(0);
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);
  const greetingRef = useRef();

  const [schedules, setSchedules] = useState([
    { weekday: "Segunda-feira",weekdayEn: "monday",startTime: "08:00",endTime: "18:00",},
    { weekday: "Terça-feira",weekdayEn: "tuesday",startTime: "08:00",endTime: "18:00",},
    { weekday: "Quarta-feira",weekdayEn: "wednesday",startTime: "08:00",endTime: "18:00",},
    { weekday: "Quinta-feira",weekdayEn: "thursday",startTime: "08:00",endTime: "18:00",},
    { weekday: "Sexta-feira", weekdayEn: "friday",startTime: "08:00",endTime: "18:00",},
    { weekday: "Sábado", weekdayEn: "saturday",startTime: "08:00",endTime: "12:00",},
    { weekday: "Domingo", weekdayEn: "sunday",startTime: "00:00",endTime: "00:00",},
  ]);

  useEffect(() => {
    api.get(`/settings`).then(({ data }) => {
      if (Array.isArray(data)) {
        const scheduleType = data.find((d) => d.key === "scheduleType");
        if (scheduleType) {
          setSchedulesEnabled(scheduleType.value === "queue");
        }
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (!queueId) return;
      try {
        const { data } = await api.get(`/queue/${queueId}`);
        setQueue((prevState) => {
          return { ...prevState, ...data };
        });
        setSchedules(data.schedules);
      } catch (err) {
        toastError(err);
      }
    })();

    return () => {
      setQueue({
        name: "",
        color: "",
        greetingMessage: "",
      });
    };
  }, [queueId, open]);

  const handleClose = () => {
    onClose();
    setQueue(initialState);
  };

  const handleSaveQueue = async (values) => {
    try {
      if (queueId) {
        await api.put(`/queue/${queueId}`, { ...values, schedules });
      } else {
        await api.post("/queue", { ...values, schedules });
      }
      toast.success("Queue saved successfully");
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  const handleSaveSchedules = async (values) => {
    toast.success("Clique em salvar para registar as alterações");
    setSchedules(values);
    setTab(0);
  };

  return (
    <div className={classes.root}>
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle>
          {queueId
            ? `${i18n.t("Editar Chatbot")}`
            : `${i18n.t("Adicionar Chatbot")}`}
        </DialogTitle>
           <Box sx={{
            width:"1370px",
            height:"720px",
           }}>
            <Divider />
           <DnDFlow />
           </Box>
            
 
      </Dialog>
    </div>
  );
};

export default ChatBotModal;
