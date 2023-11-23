import React, { useState, useEffect, useRef, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Box, Button, DialogActions, DialogContent, Divider, FormControl, Grid, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { CloseOutlined, DeleteOutlined } from "@material-ui/icons";


const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap"
    },

    textField: {
        marginRight: theme.spacing(1),
        flex: 1
    },

    extraAttr: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
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
    selectContainer: {
        width: "100%",
        textAlign: "left",
    },
}));


const WhatsappMenu = ({
    open,
    onClose,
}) => {
    const classes = useStyles();
    const [options, setOptions] = useState([])
    const [messageType, setMessageType] = useState("text")

    useEffect(() => {
        const options = [{
            id: 1,
            value: "Opção 1"
        }]
        setOptions(options)
    }, [])


    const handleClose = () => {
        onClose();
    };

    const handleAddOption = () => {
        const newOptions = [...options, {
            id: options.length + 1,
            value: ""
        }]
        setOptions(newOptions)
    }

    const handleDeleteOption = (id) => {
        const newOptions = options.filter((option) => option.id !== id)
        setOptions(newOptions)
    }

    const handleSelectType = (e) => {
        setMessageType(e.target.value)
    }
    return (
        <div className={classes.root}>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                scroll="paper"
            >
                <DialogTitle id="form-dialog-title">
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack>
                            <Typography variant='h6' style={{ fontWeight: "bold" }}>
                                Mensagem de Texto
                            </Typography>
                            <Typography variant='body2'>
                                Envie uma mensagem de texto para o cliente
                            </Typography>
                        </Stack>

                        <IconButton
                            size="small"
                            onClick={onClose}
                        >
                            <CloseOutlined />
                        </IconButton>

                    </Stack>
                    <Divider sx={{ my: 2 }} />
                </DialogTitle>

                <DialogContent sx={{ padding: 2 }}>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ mt: 1 }}>
                            <FormControl className={classes.selectContainer}>
                                <InputLabel id="chatbot-type-label">
                                    Tipo da mensagem
                                </InputLabel>
                                <Select
                                    variant="outlined"
                                    label="Tipo da mensagem"
                                    placeholder="Selecione o tipo de menu"
                                    fullWidth
                                    onChange={handleSelectType}


                                >
                                    <MenuItem value={"text"}>Texto</MenuItem>
                                    <MenuItem value={"list"}>Lista</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                        { messageType === "list" && options.map((option, index) => (
                            <>
                                <Grid item xs={1} sx={{ mt: 1 }}>
                                    <Box
                                        sx={{
                                            backgroundColor: '#07b67a',
                                            borderRadius: "10px",
                                            width: "40px",
                                            border: "1px solid #fff",
                                            height: "40px",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            display: "flex",
                                            color: "#fff",

                                        }}
                                    >
                                        <Typography variant="body1" fontWeight="bold" >
                                            {option.id}
                                        </Typography>
                                    </Box>


                                </Grid>
                                <Grid item xs={3} sx={{ mt: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="Menu"
                                        size="small"
                                        name={`option-${index}`}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={7} sx={{ mt: 1 }}>
                                    <TextField
                                        multiline
                                        fullWidth
                                        label="Mensagem"
                                        size="small"
                                        name={`option-${index}`}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={1} sx={{ mt: 1 }}>
                                    <Tooltip title="Excluir">
                                        <IconButton
                                            onClick={() => handleDeleteOption(option.id)}
                                            title="Excluir"
                                            size="small">
                                            <DeleteOutlined />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>

                            </>
                        ))}
                        { messageType === "text" && (
                            <Grid item xs={12} sx={{ mt: 1 }}>
                            <TextField
                                multiline
                                fullWidth
                                label="Mensagem"
                                size="small"
                                rows={2}
                                name={`text`}
                                variant="outlined"
                            />
                        </Grid>
                        )}


                    </Grid>


                    { messageType === "list" && (
                    <Stack justifyContent="center" display="flex" alignItems="center">
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2, width: "83%" }}
                            size="small"
                            onClick={handleAddOption}
                        >
                            Adicionar Opção +
                        </Button>
                    </Stack>
                    )}
                </DialogContent>

                <DialogActions>

                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleClose} color="primary" variant="contained">
                        Salvar
                    </Button>
                </DialogActions>

            </Dialog>
        </div>
    );
};

export default WhatsappMenu;
