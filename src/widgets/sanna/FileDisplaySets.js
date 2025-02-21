import React from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Button, Divider, Fade, Grid, Icon, Modal, Typography } from '@material-ui/core';
import CardContainer from './CardContainer';
import { makeStyles } from '@material-ui/core/styles';
import SannaButton from './Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  file: {
    color: theme.palette.secondary.main,
  },
}));

function FileDisplayItem(props) {
  const classes = useStyles();

  return (
    <div className="border rounded border-gray-300 py-6 px-10">
      <Grid
        container
        spacing={1}
      >
        <Grid
          item
          xs={6}
        >
          <div className={clsx(classes.file, 'flex items-center')}>
            <Icon className="mr-10 material-icons-outlined">{props.icon}</Icon>
            <span
              className="font-stagsans font-medium leading-loose truncate inline-block"
              style={{ width: '84%' }}
            >
              {props.name}
            </span>
          </div>
        </Grid>

        <Grid
          item
          xs={3}
        >
          <SannaButton
            size="small"
            onClick={props.onSee}
          >
            Ver
          </SannaButton>
        </Grid>

        <Grid
          item
          xs={3}
        >
          <SannaButton
            onClick={props.onDownload}
            size="small"
            variant="outlined"
          >
            Descargar
          </SannaButton>
        </Grid>
      </Grid>
    </div>
  );
}

FileDisplayItem.propTypes = {
  name: PropTypes.string.isRequired,
  onSee: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  icon: PropTypes.string,
};

FileDisplayItem.defaultProps = {
  icon: 'folder',
};

function FileDisplayList(props) {
  return (
    <div>
      <div className="flex justify-between">
        <Typography
          variant="h6"
          className="text-14 py-6 leading-loose"
        >
          {props.title}
        </Typography>
        <Button
          className="text-14 normal-case font-medium"
          color="primary"
          endIcon={<GetAppIcon />}
          onClick={props.onDownload}
        >
          Descargar todo
        </Button>
      </div>

      <Divider className="mb-16" />

      <div className="flex flex-col gap-10">
        {props.items.map((item, index) => (
          <FileDisplayItem
            key={index}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

FileDisplayList.propTypes = {
  onDownload: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape(FileDisplayItem.propTypes)),
};

function FileDisplaySets(props) {
  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className="flex items-center justify-center"
      open={props.open}
      //   onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <div className="outline-none">
          <CardContainer>
            <div style={{ width: '700px' }}>
              <Typography
                variant="h6"
                className="text-16 mb-16"
              >
                {props.title}
              </Typography>

              <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
                {props.fileList.map((blockFile, index) => (
                  <div
                    key={index}
                    className="mb-16"
                  >
                    <FileDisplayList {...blockFile} />
                  </div>
                ))}
              </div>

              <Divider className="mb-16" />

              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  xs={4}
                />
                <Grid
                  item
                  xs={4}
                >
                  <SannaButton
                    onClick={props.onCancel}
                    variant="outlined"
                  >
                    Cancelar
                  </SannaButton>
                </Grid>
                <Grid
                  item
                  xs={4}
                >
                  <SannaButton
                    onClick={props.onDownload}
                    endIcon={<GetAppIcon />}
                  >
                    Descargar todo
                  </SannaButton>
                </Grid>
              </Grid>
            </div>
          </CardContainer>
        </div>
      </Fade>
    </Modal>
  );
}

FileDisplaySets.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  fileList: PropTypes.arrayOf(PropTypes.shape(FileDisplayList.propTypes)),
};
FileDisplaySets.defaultProps = {
  title: 'Documentos profesionales',
  open: false,
  fileList: [],
};

export default FileDisplaySets;

export { FileDisplayList, FileDisplayItem };
