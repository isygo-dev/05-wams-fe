import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  TableChart,
  DeleteOutline,
  AddBox,
  ViewColumn,
  ViewStream,
  BorderClear,
  RemoveCircle,
} from '@mui/icons-material';
import { Editor } from '@tiptap/react';

interface TableMenuProps {
  editor: Editor;
}

const TableMenu: React.FC<TableMenuProps> = ({ editor }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    handleClose();
  };

  return (
    <>
      <Tooltip title="Tableau">
        <IconButton onClick={handleOpen} color={editor.isActive('table') ? 'primary' : 'default'}>
          <TableChart />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={insertTable}>
          <ListItemIcon><AddBox fontSize="small" /></ListItemIcon>
          <ListItemText>Insérer un tableau</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { editor.chain().focus().addRowAfter().run(); handleClose(); }}>
          <ListItemIcon><ViewStream fontSize="small" /></ListItemIcon>
          <ListItemText>Ajouter ligne</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { editor.chain().focus().addColumnAfter().run(); handleClose(); }}>
          <ListItemIcon><ViewColumn fontSize="small" /></ListItemIcon>
          <ListItemText>Ajouter colonne</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { editor.chain().focus().deleteRow().run(); handleClose(); }}>
          <ListItemIcon><RemoveCircle fontSize="small" /></ListItemIcon>
          <ListItemText>Supprimer ligne</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { editor.chain().focus().deleteColumn().run(); handleClose(); }}>
          <ListItemIcon><BorderClear fontSize="small" /></ListItemIcon>
          <ListItemText>Supprimer colonne</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { editor.chain().focus().deleteTable().run(); handleClose(); }}>
          <ListItemIcon><DeleteOutline fontSize="small" /></ListItemIcon>
          <ListItemText>Supprimer tableau</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default TableMenu;
