import { InputBase } from '@material-ui/core';
import Accordion from '@material-ui/core/ExpansionPanel';
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';
import AccordionProtocolFile from './AccordionProtocolFile';
import AccordionProtocolMenu from './AccordionProtocolMenu';
import AccordionSummary from '@material-ui/core/ExpansionPanelSummary';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import AddIcon from '@material-ui/icons/Add';
import Button from 'widgets/sanna/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import React from 'react';
import Api from 'inc/Apiv2';
import Alert from 'inc/Alert';
import { v4 as uuid } from 'uuid';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';

const AccordionProtocol = props => {
  const uidInputFileAdd = uuid();

  const uploadFile = async (file, rowIndex = null) => {
    if (!file) return;

    const formdata = new FormData();
    formdata.append('file', file);

    const response = await Api.post('/files/pdf-jpeg-png', formdata);
    if (!response.ok) return Alert.error(response.message);

    props.onUploadedFile({
      id: response.data.id,
      url: response.data.url,
      name: file.name,
      rowIndex,
    });
  };

  const FileInput = props => (
    <input
      id={props.id}
      type="file"
      className="hidden"
      accept="application/pdf, image/jpeg, image/png"
      onChange={props.onChange}
    />
  );

  return (
    <div
      className="flex"
      aria-label="accordion protocol wrapper"
    >
      <div className="flex-1">
        <Accordion
          aria-label="accordion protocol"
          expanded={props.expanded}
          className={props.creating || props.expanded ? 'shadow-none' : 'accordion-summary'}
          style={{ borderRadius: '8px' }}
        >
          <AccordionSummary
            aria-label="accordion summary"
            expandIcon={<ExpandMoreIcon />}
            IconButtonProps={{
              onClick: props.onExpand,
            }}
            style={{
              borderRadius: '8px',
              backgroundColor: props.expanded ? '#E8F9F6' : '#fff',
              border: props.creating || props.expanded ? '1px solid #00B050' : undefined,
            }}
            classes={{
              content: 'm-0',
            }}
          >
            <InputBase
              aria-label="accordion summary title"
              readOnly={props.creating ? false : props.editing ? false : true}
              className="w-full font-medium"
              placeholder="Nombre de protocolo"
              value={props.title}
              onChange={props.onChangeTitle}
            />
          </AccordionSummary>
          <AccordionDetails
            aria-label="accordion details"
            className={clsx(
              'bg-gray-50 py-20 px-24 rounded-b-8',
              props.amSubProtocol && 'border border-muiprimary rounded-t-8 border-t-0',
            )}
          >
            <div
              aria-label="accordion details container"
              className="w-full"
            >
              <div
                className="flex flex-col gap-16 mb-16"
                aria-label="accordion details content"
              >
                {!props.creating && !props.editing && !props.description ? null : (
                  <InputBase
                    aria-label="accordion details description"
                    readOnly={props.creating ? false : props.editing ? false : true}
                    className="w-full"
                    multiline
                    rows={5}
                    placeholder={props.creating || props.editing ? 'Ingrese descripcion' : ''}
                    value={props.description}
                    onChange={props.onChangeDescription}
                  />
                )}

                {props.files.map((file, index) => {
                  const uid = uuid();

                  return (
                    <div key={index}>
                      <AccordionProtocolFile
                        {...file}
                        editing={props.editing}
                        onEdit={() => window.document.getElementById(uid).click()}
                      />
                      <FileInput
                        id={uid}
                        onChange={e => uploadFile(e.target.files[0], index)}
                      />
                    </div>
                  );
                })}

                {props.editing && (
                  <div>
                    <Button
                      onClick={() => window.document.getElementById(uidInputFileAdd).click()}
                      fullWidth
                      color="secondary"
                      variant="text"
                      className="bg-muisecondary-light text-black shadow-none border border-solid rounded-8"
                      style={{ borderColor: '#A6B3FF' }}
                      startIcon={<AddCircleOutlinedIcon className="text-muisecondary" />}
                    >
                      Agregar documento
                    </Button>
                    <FileInput
                      id={uidInputFileAdd}
                      onChange={e => uploadFile(e.target.files[0])}
                    />
                  </div>
                )}
              </div>

              {!props.creating && !props.amSubProtocol ? (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {props.loadingSubprotocols && (
                      <>
                        <span className="text-12 mr-16">Cargando subprotocolos ...</span>
                        <CircularProgress size="2rem" />
                      </>
                    )}
                  </div>
                  {props.readOnly ? (
                    <div></div>
                  ) : (
                    <Button
                      aria-label="accordion details add subprotocol"
                      color="secondary"
                      variant="text"
                      startIcon={<AddIcon />}
                      onClick={props.onAddSubprotocol}
                    >
                      Añadir sub protocolo
                    </Button>
                  )}
                </div>
              ) : null}

              {Array.isArray(props.subprotocols) && props.subprotocols.length ? (
                <div
                  aria-label="accordion details container subprotocols"
                  className="mt-12 flex flex-col gap-12"
                >
                  {props.subprotocols}
                </div>
              ) : null}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      {!props.readOnly && (
        <div className="ml-12 pt-8">
          <AccordionProtocolMenu
            creating={props.creating}
            editing={props.editing}
            {...props.menuActions}
          />
        </div>
      )}
    </div>
  );
};

AccordionProtocol.propTypes = {
  readOnly: PropTypes.bool,
  loadingSubprotocols: PropTypes.bool,
  amSubProtocol: PropTypes.bool,
  title: PropTypes.string.isRequired,
  editing: PropTypes.bool,
  creating: PropTypes.bool,
  expanded: PropTypes.bool,
  onExpand: PropTypes.func.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  onChangeDescription: PropTypes.func.isRequired,
  onUploadedFile: PropTypes.func.isRequired,
  onAddSubprotocol: PropTypes.func,
  files: PropTypes.arrayOf(
    PropTypes.shape(
      (function () {
        const { editing, onEdit, ...result } = AccordionProtocolFile.propTypes;
        return result;
      })(),
    ),
  ),
  subprotocols: PropTypes.arrayOf(AccordionProtocol),
  menuActions: PropTypes.shape(
    (function () {
      const { creating, editing, ...result } = AccordionProtocolMenu.propTypes;
      return result;
    })(),
  ),
};

AccordionProtocol.defaultProps = {
  readOnly: false,
  loadingSubprotocols: false,
  amSubProtocol: false,
  creating: false,
  editing: false,
  expanded: false,
  title: '',
  description: '',
  files: [],
  subprotocols: [],
  onUploadedFile: () => {},
};

export default AccordionProtocol;
