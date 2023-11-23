import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Button,
  TextField,
  DialogContent,
  DialogActions,
  Grid
} from "@material-ui/core";
import PropType from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Dialog from "../Dialog";
import ConfirmationModal from "../ConfirmationModal";
import api from "../../services/api";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { head } from "lodash";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { i18n } from "../../translate/i18n";
import { makeStyles } from "@material-ui/core/styles";
import ButtonWithSpinner from "../ButtonWithSpinner";
import { AuthContext } from "../../context/Auth/AuthContext";
import { FormControlLabel, Switch } from "@material-ui/core";
import { toast } from "react-toastify";

import { isNil, isObject, has, get } from "lodash";

const MessageSchema = Yup.object().shape({
  shortcode: Yup.string().required("Required"),
  message: Yup.string().required("Required")
});

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "350px"
    }
  },
  list: {
    width: "100%",
    maxWidth: "350px",
    maxHeight: "200px",
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    width: "100%"
  }
}));

function ScheduleMessageDialog(props) {
  const classes = useStyles();

  const initialMessage = {
    id: null,
    shortcode: "",
    message: "",
    isGlobal: false
  };

  const { modalOpen, saveMessage, editMessage, onClose, messageSelected } =
    props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
  const [quickMessage, setScheduleMessage] = useState(null);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isGlobal, setIsGlobal] = useState(false);
  const attachmentFile = useRef(null);

  const { user } = useContext(AuthContext);
  const { profile } = user;

  useEffect(() => {
    verifyAndSetMessage();
    setDialogOpen(modalOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  useEffect(() => {
    verifyAndSetMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageSelected]);

  const messageSelectedIsValid = () => {
    return (
      isObject(messageSelected) &&
      has(messageSelected, "id") &&
      !isNil(get(messageSelected, "id"))
    );
  };

  const verifyAndSetMessage = () => {
    if (messageSelectedIsValid()) {
      const { id, message, shortcode, isGlobal } = messageSelected;
      setMessage({ id, message, shortcode, isGlobal });
    } else {
      setMessage(initialMessage);
    }
  };

  const handleClose = () => {
    onClose();
    setIsGlobal(false);
    setAttachment(null);
    setLoading(false);
  };

  const handleAttachmentFile = e => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };
  const deleteMedia = async () => {
    if (attachment) {
      setAttachment(null);
      attachmentFile.current.value = null;
    }

    if (quickMessage?.mediaPath) {
      await api.delete(`/quickMessages/${quickMessage.id}/media-upload`);
      setScheduleMessage(prev => ({
        ...prev,
        mediaPath: null
      }));
      toast.success(i18n.t("schedules.toasts.deleted"));
      if (typeof props.reload == "function") {
        props.reload();
      }
    }
  };

  const handleSave = async values => {
    if (messageSelectedIsValid()) {
      editMessage({
        ...messageSelected,
        ...values,
        userId: user.id,
        isGlobal
      });
    } else {
      saveMessage({
        ...values,
        userId: user.id,
        isGlobal
      });
    }
    handleClose();
  };

  return (
    <Dialog
      title="Mensagem de agendamento"
      modalOpen={dialogOpen}
      onClose={handleClose}
    >
      <ConfirmationModal
        title={i18n.t("campaigns.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      >
        {i18n.t("campaigns.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <div style={{ display: "none" }}>
        <input
          type="file"
          ref={attachmentFile}
          onChange={e => handleAttachmentFile(e)}
        />
      </div>
      <Formik
        initialValues={message}
        enableReinitialize={true}
        validationSchema={MessageSchema}
        onSubmit={(values, actions) => {
          setLoading(true);
          setTimeout(() => {
            handleSave(values);
            actions.setSubmitting(false);
          }, 400);
        }}
      >
        {({ touched, errors, isSubmitting, values }) => (
          <Form>
            <DialogContent className={classes.root} dividers>
              <Grid direction="column" container>
                <Grid item>
                  <Field
                    as={TextField}
                    name="shortcode"
                    label={i18n.t("Titulo")}
                    error={touched.shortcode && Boolean(errors.shortcode)}
                    helperText={touched.shortcode && errors.shortcode}
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  <Field
                    as={TextField}
                    name="message"
                    label={i18n.t("quickMessages.dialog.message")}
                    multiline={true}
                    error={touched.message && Boolean(errors.message)}
                    helperText={touched.message && errors.message}
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  {profile === "admin" && (
                    <FormControlLabel
                      style={{ marginRight: 7, color: "gray" }}
                      label="Geral"
                      labelPlacement="start"
                      control={
                        <Switch
                          size="small"
                          checked={isGlobal || messageSelected?.isGlobal}
                          onChange={() => setIsGlobal(!isGlobal)}
                          name="isGlobalMessage"
                          color="primary"
                        />
                      }
                    />
                  )}
                </Grid>
                {/* {(quickMessage?.mediaPath || attachment) && (
                  <Grid xs={12} item>
                    <Button startIcon={<AttachFileIcon />}>
                      {attachment != null
                        ? attachment?.name
                        : quickMessage.mediaName}
                    </Button>
                    <IconButton
                      onClick={() => setConfirmationOpen(true)}
                      color="secondary"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Grid>
                )} */}
              </Grid>
            </DialogContent>
            <DialogActions>
              {/* {!attachment && !values?.mediaPath && (
                <Button
                  color="primary"
                  onClick={() => attachmentFile.current.click()}
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("schedules.dialogs.buttons.attach")}
                </Button>
              )} */}
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <ButtonWithSpinner
                loading={loading}
                color="primary"
                type="submit"
                variant="contained"
                autoFocus
              >
                Salvar
              </ButtonWithSpinner>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

ScheduleMessageDialog.propType = {
  modalOpen: PropType.bool,
  onClose: PropType.func
};

export default ScheduleMessageDialog;
