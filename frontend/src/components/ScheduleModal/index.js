import React, { useState, useEffect, useContext, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { head } from "lodash";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import { Stack } from "@mui/material";
import IconButton from "@material-ui/core/IconButton";
import { i18n } from "../../translate/i18n";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { Box, Divider, FormControl, Grid, Typography ,Select,ListItemText,MenuItem} from "@material-ui/core";
import moment from "moment";
import { AuthContext } from "../../context/Auth/AuthContext";
import { isArray, capitalize } from "lodash";
import ConfirmationModal from "../ConfirmationModal";
import useScheduleMessages from "../../hooks/useScheduleMessages";


const filterOptions = createFilterOptions({
  trim: true,
});

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },

  multFieldLine: {
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1)
    }
  },

  uploadButton: {
    display: "flex",
    flexWrap: "wrap"
  },

  uploadInput: {
    display: "none"
  },

  sendMessageIcons: {
    color: "grey"
  },

  chipsField: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    border: "1px solid rgba(0, 0, 0, 0.25)",
    borderRadius: 4,
    paddingTop: 8,
    paddingBottom: 8
  },

  chipBox: {
    margin: 2,
    height: 28
  },

  btnWrapper: {
    position: "relative"
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const ScheduleSchema = Yup.object().shape({
  body: Yup.string()
    .min(5, "Mensagem muito curta")
    .required("Obrigatório")
    .max(Infinity),
  contactId: Yup.number().required("Obrigatório"),
  sendAt: Yup.string().required("Obrigatório")
});

const ScheduleModal = ({
  open,
  onClose,
  scheduleData,
  contactId,
  cleanContact,
  reload
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const initialState = {
    body: "",
    contactId: "",
    sendAt: moment().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
    sentAt: ""
  };

  const initialContact = {
    id: "",
    name: ""
  };
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [schedule, setSchedule] = useState(initialState);
  const [currentContact, setCurrentContact] = useState(initialContact);
  const [contacts, setContacts] = useState([initialContact]);
  const [text, setText] = useState("");
  const [options, setOptions] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const attachmentFile = useRef(null);
  const [loading, setLoading] = useState(false);
  const [blockScope, setBlockScope] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [selecteds, setSelecteds] = useState("");

  const {
    list: listMessages,
    save: saveMessage,
    update: updateMessage,
    deleteRecord: deleteMessage
  } = useScheduleMessages();



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
      setOptions(messages);
    } catch (e) {
      toast.error(e);
    }
    setLoading(false);
    console.log(options, "meu options")
  };

  //console.log(schedule)
  useEffect(() => {
    if (contactId && contacts.length) {
      const contact = contacts.find(c => c.id === contactId);
      if (contact) {
        setCurrentContact(contact);
      }
    }
  }, [contactId, contacts]);

  useEffect(() => {
    const { companyId } = user;
    if (open) {
      try {
        (async () => {
          const { data: contactList } = await api.get("/contacts/list", {
            params: { companyId: companyId }
          });
          let customList = contactList.map(c => ({ id: c.id, name: c?.name }));
          if (isArray(customList)) {
            setContacts([{ id: "", name: "" }, ...customList]);
          }
          if (contactId) {
            setSchedule(prevState => {
              return { ...prevState, contactId };
            });
          }

          if (!scheduleData?.id) return;

          const { data } = await api.get(`/schedules/${scheduleData?.id}`);
          setSchedule(prevState => {
            return {
              ...prevState,
              ...data,
              sendAt: moment(data.sendAt).format("YYYY-MM-DDTHH:mm")
            };
          });
          setCurrentContact(data.contact);
          setText(data?.body);




        })();
      } catch (err) {
        toastError(err);
      }
    }
  }, [scheduleData?.id, contactId, open, user]);

  const handleClose = () => {
    onClose();
    setAttachment(null);
    setSchedule(initialState);
    setBlockScope(false);
    setSelectedMessage("");
    setSelecteds("");
  };

  const handleAttachmentFile = e => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };

  const handleSaveSchedule = async values => {
    const scheduleData = { ...values, userId: user.id };
    try {
      if (scheduleData?.id) {
        await api.put(`/schedules/${scheduleData?.id}`, scheduleData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(
            `/schedules/${scheduleData.id}/media-upload`,
            formData
          );
        }
      } else {
        const { data } = await api.post("/schedules", scheduleData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(`/schedules/${data.id}/media-upload`, formData);
        }
      }
      toast.success(i18n.t("scheduleModal.success"));
      if (typeof reload == "function") {
        reload();
      }
      if (contactId) {
        if (typeof cleanContact === "function") {
          cleanContact();
          history.push("/schedules");
        }
      }
    } catch (err) {
      toastError(err);
    }
    setCurrentContact(initialContact);
    setSchedule(initialState);
    handleClose();
  };

  const deleteMedia = async () => {
    if (attachment) {
      setAttachment(null);
      attachmentFile.current.value = null;
    }

    if (schedule.mediaPath) {
      await api.delete(`/schedules/${schedule.id}/media-upload`);
      setSchedule(prev => ({
        ...prev,
        mediaPath: null
      }));
      toast.success(i18n.t("schedules.toasts.deleted"));
      if (typeof reload == "function") {
        reload();
      }
    }
  };

  const handleClick = typeName => {
    setSchedule(prev => {
      return { ...prev, body: prev.body + typeName };
    });
  };

  const handleChangeOption = async (value) => {
    setSelecteds(value);
    if(value){
      setSchedule(prev => {
        return { ...prev, body: value?.message };
      });
    }else{
      setSchedule(prev => {
        return { ...prev, body: "" };
      });
    }
  };

  const handleChange = e => {
    const newText = e.target.value;
    setSchedule(prev => {
      return { ...prev, body: newText };
    });
  };
  //console.log(scheduleData, "meu schedule")
  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={i18n.t("campaigns.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      >
        {i18n.t("campaigns.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          {schedule.status === "ERRO"
            ? "Erro de Envio"
            : `Mensagem ${capitalize(schedule.status)}`}
        </DialogTitle>
        <div style={{ display: "none" }}>
          <input
            type="file"
            ref={attachmentFile}
            onChange={e => handleAttachmentFile(e)}
          />
        </div>
        <Formik
          initialValues={schedule}
          enableReinitialize={true}
          validationSchema={ScheduleSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveSchedule(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.multFieldLine}>
                  <FormControl variant="outlined" fullWidth>
                    <Autocomplete
                      fullWidth
                      value={currentContact}
                      options={contacts}
                      onChange={(e, contact) => {
                        const contactId = contact ? contact.id : "";
                        setSchedule({ ...schedule, contactId });
                        setCurrentContact(contact ? contact : initialContact);
                      }}
                      getOptionLabel={option => option?.name}
                      getOptionSelected={(option, value) => {
                        return value.id === option.id;
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Contato"
                        />
                      )}
                    />
                  </FormControl>
                </div>
                <br />
                <div>
                <Autocomplete
                    
                    size="small"
                    options={options}
                    value={selecteds}
                    onChange={(e, v, r) => handleChangeOption(v)}
                    getOptionLabel={(option) => option?.shortcode}
                    getOptionSelected={(option, value) => {
                      return (
                        option?.id === value?.id ||
                        option?.shortcode?.toLowerCase() === value?.shortcode?.toLowerCase()
                      );
                    }}
                    renderTags={(value, getUserProps) =>
                      options.map((option, index) => (
                        <Chip
                          variant="outlined"
                          style={{
                            backgroundColor: "#bfbfbf",
                            textShadow: "1px 1px 1px #000",
                            color: "white",
                          }}
                          label={option?.shortcode}
                          {...getUserProps({ index })}
                          size="small"
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Mensagem padrão"
                      />
                    )}
                  />
                </div>
                <br />
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    onChange={handleChange}
                    rows={9}
                    value={schedule?.body}
                    multiline={true}
                    label={i18n.t("scheduleModal.form.body")}
                    name="body"
                    error={touched.body && Boolean(errors.body)}
                    helperText={touched.body && errors.body}
                    variant="outlined"
                    margin="dense"
             
                    fullWidth
                  />
                </div>
                <br />
                <span>Variáveis</span>
                <div className={classes.chipsField}>
                  <Chip
                    className={classes.chipBox}
                    label="Saudações"
                    onClick={e => handleClick("{{greeting}}")}
                  />

                  <Chip
                    className={classes.chipBox}
                    label="Nome do contato"
                    onClick={e => handleClick("{{contactName}}")}
                  />
                  <Chip
                    className={classes.chipBox}
                    label="Número do contato"
                    onClick={e => handleClick("{{contactNumber}}")}
                  />
                </div>
                <br />
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t("scheduleModal.form.sendAt")}
                    type="datetime-local"
                    name="sendAt"
                    InputLabelProps={{
                      shrink: true
                    }}
                    error={touched.sendAt && Boolean(errors.sendAt)}
                    helperText={touched.sendAt && errors.sendAt}
                    variant="outlined"
                    fullWidth
                  />
                </div>
                {(schedule.mediaPath || attachment) && (
                  <Grid xs={12} item>
                    <Button startIcon={<AttachFileIcon />}>
                      {attachment != null
                        ? attachment?.name
                        : schedule.mediaName}
                    </Button>
                    <IconButton
                      onClick={() => setConfirmationOpen(true)}
                      color="secondary"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Grid>
                )}
              </DialogContent>
              <DialogActions>
                {!attachment && !schedule.mediaPath && (
                  <Button
                    color="primary"
                    onClick={() => attachmentFile.current.click()}
                    disabled={isSubmitting}
                    variant="outlined"
                  >
                    Enviar Arquivo
                    {/*{i18n.t("schedules.dialogs.buttons.attach")}*/}
                  </Button>
                )}
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("scheduleModal.buttons.cancel")}
                </Button>
                {(schedule.sentAt === null || schedule.sentAt === "") && (
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isSubmitting}
                    variant="contained"
                    className={classes.btnWrapper}
                  >
                    {scheduleData?.id
                      ? `${i18n.t("scheduleModal.buttons.okEdit")}`
                      : `${i18n.t("scheduleModal.buttons.okAdd")}`}
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                )}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default ScheduleModal;
