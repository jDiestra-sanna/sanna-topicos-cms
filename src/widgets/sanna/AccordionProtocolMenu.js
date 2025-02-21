import React from 'react';
import PropTypes from 'prop-types';
import { Icon, IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';

const AccordionProtocolMenu = props => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      {props.creating || props.editing ? (
        <IconButton
          color="primary"
          size="small"
          className="bg-muiprimary text-white hover:bg-muiprimary"
          onClick={props.onSave}
        >
          <CheckOutlinedIcon />
        </IconButton>
      ) : (
        <>
          <IconButton
            color="primary"
            size="small"
            className="bg-white"
            onClick={handleClick}
          >
            <MoreHorizIcon />
          </IconButton>
          <Menu
            elevation={0}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              className: 'rounded-12 shadow-xs',
            }}
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              className="text-muisecondary"
              onClick={() => {
                handleClose();
                props.onEdit();
              }}
            >
              <Icon className="mr-16 material-icons-outlined">edit</Icon> <span className="font-medium">Editar</span>
            </MenuItem>
            <MenuItem
              className="text-muired"
              onClick={() => {
                handleClose();
                props.onDelete();
              }}
            >
              <Icon className="mr-16 material-icons-outlined">delete</Icon>{' '}
              <span className="font-medium">Eliminar</span>
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
};

AccordionProtocolMenu.propTypes = {
  creating: PropTypes.bool,
  editing: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

AccordionProtocolMenu.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
};

export default AccordionProtocolMenu;
