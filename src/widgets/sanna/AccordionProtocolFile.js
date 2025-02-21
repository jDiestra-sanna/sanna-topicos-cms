import React from 'react';
import PropTypes from 'prop-types';
import Button from 'widgets/sanna/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';

const AccordionProtocolFile = props => {
    return (
      <div className="shadow-xs rounded-8 flex justify-between py-4 px-12 cursor-pointer">
        <div className="flex items-center text-muisecondary">
          <Button
            startIcon={<FolderOutlinedIcon />}
            variant="text"
            className="text-muisecondary"
          >
            {props.name}
          </Button>
        </div>
        <div className="flex gap-8 ">
          {props.editing ? (
            <>
              <Button
                startIcon={<EditIcon />}
                variant="text"
                className="text-muisecondary"
                onClick={props.onEdit}
              >
                Editar
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                variant="text"
                className="text-muired"
                onClick={props.onDelete}
              >
                Eliminar
              </Button>
            </>
          ) : (
            <>
              <Button
                className="w-128"
                onClick={props.onSee}
              >
                Ver
              </Button>
              <Button
                variant="outlined"
                className="text-black w-128"
                onClick={props.onDownload}
              >
                Descargar
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };
  
  AccordionProtocolFile.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    editing: PropTypes.bool.isRequired,
    onSee: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSee: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
  };
  AccordionProtocolFile.defaultProps = {
    editing: false,
  };


export default AccordionProtocolFile;
