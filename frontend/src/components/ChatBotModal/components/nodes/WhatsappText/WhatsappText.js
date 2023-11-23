import { Box, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ArrowRightAltOutlined, AudiotrackOutlined, CloseOutlined, FolderOpenOutlined, FolderOutlined, HeadsetOutlined, ImageOutlined, MicOutlined, MusicNoteOutlined, PeopleAltOutlined, PhotoAlbumOutlined, SettingsOutlined, VoiceOverOffOutlined, WhatsApp } from '@material-ui/icons';
import WhatsappMenu from './menu';


export default memo(({ data, isConnectable }) => {
    const [openMenu, setOpenMenu] = React.useState(false);
    return (
        <Box
            sx={{
                height: "auto",
                minHeight: "100px",
                border: "1px solid #dfdfd",
                borderRadius: "10px",
                width: "300px",
                boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
                backgroundColor: "#f0f0f0",
                padding: "10px",
                display : "flex",
                alignItems : "center",
            }}
        >
            <WhatsappMenu 
                open={openMenu}
                onClose={() => setOpenMenu(false)}
            />
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: 'green', width: "12px", height: "12px", border: "1px solid #fff", boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)" }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
            />
            <Stack direction="row">
                <Box sx={{
                    backgroundColor: '#07b67a',
                    width: "40px",
                    height: "40px",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    display: "flex",
                    marginRight: "10px",
                    marginLeft: "10px",
                }}>
                    <WhatsApp
                        style={{
                            color: "#fff",
                            fontSize: "30px",
                        }}
                    />
                </Box>
                <Stack>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant='body2' style={{ fontWeight: "bold" }}>
                        Mensagem de Texto
                    </Typography>
                    <IconButton 
                        size="small"
                        onClick={() => setOpenMenu(true)}
                        >
                            <SettingsOutlined />
                        </IconButton>

                    </Stack>
                    <Typography variant='caption'>
                        Envie uma mensagem de texto
                    </Typography>
                </Stack>


            </Stack>

            <Stack>
                <Box sx={{ backgroundColor: "white", borderRadius: "0px 0px 12px 12px" }}>
                    <Tooltip
                        title="Clique para editar"
                        placement="right"
                        arrow
                    >
                        <Handle
                            type="source"
                            position={Position.Right}
                            id="a"
                            style={{ bottom: 0, top: "auto", background: 'red', width: "12px", height: "12px", border: "1px solid #fff", boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)" }}
                            isConnectable={isConnectable}
                        />

                    </Tooltip>

                </Box>
                <Box sx={{ backgroundColor: "white", borderRadius: "0px 0px 12px 12px" }}>
                    <Tooltip
                        title="Clique para editar"
                        placement="right"
                        arrow
                    >
                        <Handle
                            type="source"
                            position={Position.Right}
                            id="a"
                            style={{ bottom: 15, top: "auto", background: 'blue', width: "12px", height: "12px", border: "1px solid #fff", boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)" }}
                            isConnectable={isConnectable}
                        />

                    </Tooltip>

                </Box>
                        


            </Stack>







        </Box>
    );
});