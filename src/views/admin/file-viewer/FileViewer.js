import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'app/fuse-layouts/layout1/components/PageWrapper';
import { Typography, makeStyles } from '@material-ui/core';
import ArrowBackButton from 'widgets/sanna/ArrowBackButton';
import history from '@history';
import CardContainer from 'widgets/sanna/CardContainer';
import WLoading from 'widgets/WLoading';
import Api from 'inc/Apiv2';
import Alert from 'inc/Alert';
import { Document, Page, pdfjs } from 'react-pdf';
import { Pagination } from '@material-ui/lab';
import clsx from 'clsx';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles(theme => ({
  cardContentClassName: {
    height: '68vh',
    overflow: 'auto',
    [theme.breakpoints.down('lg')]: {
      height: '58vh',
    },
  },
  paginationContainer: {
    height: '32px',
  },
  pagination: {
    position: 'fixed',
    zIndex: 100,
    backgroundColor: 'white',
  },
  documentPDF: {
    maxHeight: '1200px',
    width: 'max-content',
    overflowY: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
}));

const URL_SEARCH = {
  DESCRIPTION: 'description',
  URL_TO_BACK: 'url_to_back',
};

function FileViewer(props) {
  const { fileId } = props.match.params;
  const urlSearchParams = new URLSearchParams(props.location.search);
  const description = urlSearchParams.get(URL_SEARCH.DESCRIPTION);
  const url_to_back = urlSearchParams.get(URL_SEARCH.URL_TO_BACK);
  const classes = useStyles(props);
  const canvasRef = React.useRef(null);
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [file, setFile] = React.useState(null);
  const [error, setError] = React.useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  async function loadFile() {
    if (!fileId) return setError('ID de archivo indefinido');

    const response = await Api.get(`/files/${fileId}`);
    if (!response.ok) {
      setError('Error al obtener el archivo');
      return Alert.error(response.message);
    }

    setError(null);
    setFile(response.data);
  }

  React.useEffect(() => {
    loadFile();
  }, []);

  if (error) {
    return (
      <PageWrapper>
        <div className="relative">
          <ArrowBackButton
            onClick={() => (url_to_back ? history.push(url_to_back) : history.goBack())}
            style={{ position: 'absolute', left: '-70px', top: '-4px' }}
          />
        </div>
        <Typography variant="subtitle1">{error}</Typography>
      </PageWrapper>
    );
  }

  if (!file) return <WLoading />;

  return (
    <PageWrapper>
      <div className="relative">
        <ArrowBackButton
          onClick={() => (url_to_back ? history.push(url_to_back) : history.goBack())}
          style={{ position: 'absolute', left: '-70px', top: '-4px' }}
        />
      </div>
      <Typography
        variant="h5"
        className={clsx('font-semibold truncate', !description && 'mb-28')}
      >
        {file.name}
      </Typography>

      {description && (
        <Typography
          variant="subtitle1"
          className="mb-28"
        >
          {description}
        </Typography>
      )}

      <CardContainer cardContentClassName={classes.cardContentClassName}>
        {/(.png|.jpg|.jpeg|.avif|.webp)$/.test(file.url) ? (
          <img
            src={file.url}
            className={classes.img}
          />
        ) : /.pdf$/.test(file.url) ? (
          <div>
            <div className={classes.paginationContainer}>
              <Pagination
                className={classes.pagination}
                count={numPages}
                variant="outlined"
                shape="rounded"
                onChange={(e, v) => {
                  setPageNumber(v);
                }}
              />
            </div>
            <div className={classes.documentPDF}>
              <Document
                file={file.url}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page
                  inputRef={ref => (canvasRef.current = ref)}
                  scale={1.4}
                  pageNumber={pageNumber}
                />
              </Document>
            </div>
          </div>
        ) : (
          <div>
            <Typography
              variant="body1"
              className="mb-28"
            >
              Tipo de archivo no reconocido
            </Typography>
          </div>
        )}
      </CardContainer>
    </PageWrapper>
  );
}

FileViewer.propTypes = {};

export default FileViewer;
