import { Typography } from '@material-ui/core';
import { ArrowRightAltOutlined, AudiotrackOutlined, CloseOutlined, FolderOpenOutlined, FolderOutlined, HeadsetOutlined, ImageOutlined, MicOutlined, MusicNoteOutlined, PeopleAltOutlined, PhotoAlbumOutlined, VoiceOverOffOutlined, WhatsApp } from '@material-ui/icons';
import { Box, Stack, Divider } from '@mui/material';

import React from 'react';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box style={{
      width: '340px',
    }}>
      <Box style={{
        width: '340px',
        border: '1px solid #e0e0e0',
        borderRadius: '0px 20px 0 0',
        height: '100%',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
      }}>
        <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
          <Typography variant="body1">
            Arraste e solte os módulos no fluxo
          </Typography>
          <ArrowRightAltOutlined />

        </Stack>
        <Divider sx={{ my: 2 }} />
   
        
        <Box className="dndnode" onDragStart={(event) => onDragStart(event, 'whatsappText')} draggable>
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
            <Typography variant='body2' style={{ fontWeight: "bold" }}>
              Mensagem de Texto
            </Typography>
            <Typography variant='caption'>
              Envie uma mensagem de texto
            </Typography>
          </Stack>


        </Box>
        <Box className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
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
            <ImageOutlined
              style={{
                color: "#fff",
                fontSize: "30px",
              }}
            />
          </Box>
          <Stack>
            <Typography variant='body2' style={{ fontWeight: "bold" }}>
              Imagem
            </Typography>
            <Typography variant='caption'>
              Envie uma imagem
            </Typography>
          </Stack>


        </Box>
        <Box className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
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
            <FolderOutlined
              style={{
                color: "#fff",
                fontSize: "30px",
              }}
            />
          </Box>
          <Stack>
            <Typography variant='body2' style={{ fontWeight: "bold" }}>
              Documento
            </Typography>
            <Typography variant='caption'>
              Envie um documento
            </Typography>
          </Stack>


        </Box>
        
        <Box className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
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
            <MicOutlined
              style={{
                color: "#fff",
                fontSize: "30px",
              }}
            />
          </Box>
          <Stack>
            <Typography variant='body2' style={{ fontWeight: "bold" }}>
              Mensagem de Audio
            </Typography>
            <Typography variant='caption'>
              Envie uma mensagem de audio
            </Typography>
          </Stack>


        </Box>
       

        <Box className="dndnode" onDragStart={(event) => onDragStart(event, 'output')} draggable>
          <Box sx={{
            backgroundColor: '#d1d515',
            width: "40px",
            height: "40px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            display: "flex",
            marginRight: "10px",
            marginLeft: "10px",
          }}>
            <PeopleAltOutlined
              style={{
                color: "#fff",
                fontSize: "30px",
              }}
            />
          </Box>
          <Stack>
            <Typography variant='body2' style={{ fontWeight: "bold" }}>
              Atendimento
            </Typography>
            <Typography variant='caption'>
              Direcionar para uma fila
            </Typography>
          </Stack>


        </Box>

        <Box className="dndnode" onDragStart={(event) => onDragStart(event, 'output')} draggable>
          <Box sx={{
            backgroundColor: '#d80013',
            width: "40px",
            height: "40px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            display: "flex",
            marginRight: "10px",
            marginLeft: "10px",
          }}>
            <CloseOutlined
              style={{
                color: "#fff",
                fontSize: "30px",
              }}
            />
          </Box>
          <Stack>
            <Typography variant='body2' style={{ fontWeight: "bold" }}>
              Encerrar
            </Typography>
            <Typography variant='caption'>
              Encerrar atendimento
            </Typography>
          </Stack>


        </Box>

        
      </Box>
    </Box>
  );
};
