import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { 
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    IconButton
} from '@material-ui/core';
import { AuthContext } from "../../context/Auth/AuthContext";

import {
    Edit as EditIcon,
    DeleteOutline as DeleteOutlineIcon
} from "@material-ui/icons";

import TableRowSkeleton from "../../components/TableRowSkeleton";

function ScheduleMessagesTable(props) {
    const { messages, showLoading, editMessage, deleteMessage, readOnly } = props
    const [loading, setLoading] = useState(true)
    const [rows, setRows] = useState([])
    const { user } = useContext(AuthContext);
    const { profile } = user;
    useEffect(() => {
        if (Array.isArray(messages)) {
            setRows(messages)
        }
        if (showLoading !== undefined) {
            setLoading(showLoading)    
        }
    }, [messages, showLoading])

    const handleEdit = (message) => {
        editMessage(message)
    }

    const handleDelete = (message) => {
        deleteMessage(message)
    }

    const renderRows = () => {
        return rows.map((message) => {
            return (
                <TableRow key={message.id}>
                    <TableCell align="center">{message.shortcode}</TableCell>
                    <TableCell align="left">{message.message}</TableCell>
                    {profile === "admin" && (
                        <TableCell align="center">
                            {message.isGlobal ? "Sim" : "Não"}
                        </TableCell>
                    )}
                    { !readOnly ? (
                        <TableCell align="center">
                            <IconButton
                                size="small"
                                onClick={() => handleEdit(message)}
                            >
                                <EditIcon />
                            </IconButton>

                            <IconButton
                                size="small"
                                onClick={() => handleDelete(message)}
                            >
                                <DeleteOutlineIcon />
                            </IconButton>
                        </TableCell>
                    ) : null}
                </TableRow>
            )
        })
    }

    return (
        <Table size="small">
            <TableHead style={{
                    backgroundColor: "#3d3d3d",
                    color: "#fff",
                    borderRadius: "5px"
                }}>
                <TableRow>
                    <TableCell style={{color: "#fff"}} align="center">Atalho</TableCell>
                    <TableCell style={{color: "#fff"}} align="left">Mensagem</TableCell>
                    {profile === "admin" && (
                        <TableCell style={{color: "#fff"}} align="center">Global</TableCell>
                    )}
                    { !readOnly ? (
                        <TableCell style={{color: "#fff"}} align="center">Ações</TableCell>
                    ) : null}
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? <TableRowSkeleton columns={readOnly ? 2 : 3} /> : renderRows()}
            </TableBody>
        </Table>
    )
}

ScheduleMessagesTable.propTypes = {
    messages: PropTypes.array.isRequired,
    showLoading: PropTypes.bool,
    editMessage: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired
}

export default ScheduleMessagesTable;