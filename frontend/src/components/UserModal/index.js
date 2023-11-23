import React, { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
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
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import useWhatsApps from "../../hooks/useWhatsApps";

import useAuth from "../../hooks/useAuth.js"; 
import OnlyForSuperUser from "../../components/OnlyForSuperUser";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  multFieldLine: {
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(2), // Aumentei a margem entre os campos
    },
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
    margin: theme.spacing(2), // Aumentei a margem do FormControl
    minWidth: 120,
    width: "100%", // Ajustei a largura para ocupar toda a largura disponível
  },
  maxWidth: {
    width: "100%",
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(10), // Aumentei o tamanho do avatar
    height: theme.spacing(10),
    marginBottom: theme.spacing(1),
  },
  updateImageButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
}));

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const UserModal = ({ open, onClose, userId }) => {
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useState({});
  const { getCurrentUserInfo } = useAuth();
  const initialState = {
    name: "",
    email: "",
    password: "",
    profile: "user",
    super: "",
  };

  const { user: loggedInUser } = useContext(AuthContext);

  const [user, setUser] = useState(initialState);
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);
  const [whatsappId, setWhatsappId] = useState(false);
  const { loading, whatsApps } = useWhatsApps();

  const [avatarImage, setAvatarImage] = useState(null);

  const handleAttachmentFile = (e) => {
    const file = head(e.target.files);
    if (file) {
      setAvatarImage(file);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const { data } = await api.get(`/users/${userId}`);
        setUser(prevState => ({ ...prevState, ...data }));
        const userQueueIds = data.queues?.map(queue => queue.id);
        setSelectedQueueIds(userQueueIds);
        setWhatsappId(data.whatsappId ? data.whatsappId : '');

        const userS = await getCurrentUserInfo();
        setCurrentUser(userS);
      } catch (err) {
        toastError(err);
      }
    };

    fetchUser();
  }, [userId, open]);

  const handleClose = () => {
    onClose();
    setUser(initialState);
  };

  const handleAvatarClick = () => {
    const fileInput = document.getElementById("icon-button-file");
    if (fileInput) {
      fileInput.click();
    }
  };

	const handleSaveUser = async values => {
		const userData = { ...values, whatsappId, queueIds: selectedQueueIds };

    const formData = new FormData();
    formData.append("file", avatarImage);
  
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });
  
    try {
      if (userId) {
        await api.put(`/users/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/users", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      toast.success(i18n.t("userModal.success"));
    } catch (err) {
      toastError(err);
    }
    handleClose();
  };

  const isSuper = () => currentUser.super;

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md" // Aumentei a largura do modal
        fullWidth
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          {userId
            ? `${i18n.t("userModal.title.edit")}`
            : `${i18n.t("userModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={user}
          enableReinitialize={true}
          validationSchema={UserSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveUser(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.avatarContainer}>
                  <Avatar
                    alt="Avatar"
                    src={avatarImage ? URL.createObjectURL(avatarImage) : ""}
                    className={classes.avatar}
                  />
                  <input
                    accept=".png,.jpg,.jpeg"
                    id="icon-button-file"
                    type="file"
                    onChange={(e) => handleAttachmentFile(e)}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="icon-button-file">
                    <Button
                      component="span"
                      className={classes.updateImageButton}
                    >
                      {i18n.t("Atualizar imagem")}
                    </Button>
                  </label>
                </div>
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t("userModal.form.name")}
                    autoFocus
                    name="name"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <Field
                    as={TextField}
                    label={i18n.t("userModal.form.password")}
                    type="password"
                    name="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                </div>
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t("userModal.form.email")}
                    name="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    margin="dense"
                  >
                    <Can
                      role={loggedInUser.profile}
                      perform="user-modal:editProfile"
                      yes={() => (
                        <>
                          <InputLabel id="profile-selection-input-label">
                            {i18n.t("userModal.form.profile")}
                          </InputLabel>
                          <Field
                            as={Select}
                            label={i18n.t("userModal.form.profile")}
                            name="profile"
                            labelId="profile-selection-label"
                            id="profile-selection"
                            required
                          >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="supervisor">Supervisor</MenuItem>
                          </Field>
                        </>
                      )}
                    />
                  </FormControl>
                </div>
                <Can
                  role={loggedInUser.profile}
                  perform="user-modal:editQueues"
                  yes={() => (
                    <QueueSelect
                      selectedQueueIds={selectedQueueIds}
                      onChange={values => setSelectedQueueIds(values)}
                    />
                  )}
                />

                <Can
                  role={loggedInUser.profile}
                  perform="user-modal:editQueues"
                  yes={() => (
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      className={classes.maxWidth}
                      fullWidth
                    >
                      <InputLabel>
                        {i18n.t("userModal.form.whatsapp")}
                      </InputLabel>
                      <Field
                        as={Select}
                        value={whatsappId}
                        onChange={e => setWhatsappId(e.target.value)}
                        label={i18n.t("userModal.form.whatsapp")}
                      >
                        <MenuItem value={""}>�</MenuItem>
                        {whatsApps.map(whatsapp => (
                          <MenuItem
                            key={whatsapp.id}
                            value={whatsapp.id}
                          >
                            {whatsapp.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  )}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("userModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {userId
                    ? `${i18n.t("userModal.buttons.okEdit")}`
                    : `${i18n.t("userModal.buttons.okAdd")}`}
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default UserModal;