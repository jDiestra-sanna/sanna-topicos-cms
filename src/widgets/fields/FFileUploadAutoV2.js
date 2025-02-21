import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FFile.css';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import Toast from '../../inc/Toast';
import Api from 'inc/Apiv2';
import Alert from 'inc/Alert';
import { objectToFormData } from 'inc/Utils';

function W(props) {
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(null);
  const [preview, setPreview] = useState(null);
  const [value, setValue] = useState(props.value);

  function getPreview() {
    return preview === null ? value : preview;
  }

  function tapPreview() {
    let url = getPreview();

    if (url) {
      if (url.startsWith('http')) {
        window.open(url, '_blank');
      } else {
        let image = new Image();
        image.src = url;
        image.style.cssText = 'max-width:100%';
        let w = window.open('', '_blank');
        w.document.write(image.outerHTML);
      }
    }
  }

  async function upload(file) {
    if (!file) return;

    const response = await Api.post(props.endpoint || '/files', objectToFormData({ file }), 'Subiendo...');

    if (!response.ok) {
      Toast.info(response.message);
      return false;
    }

    setValue(response.data.url);

    return response.data;
  }

  return (
    <div className={'w-FFile' + (file ? ' valued' : '')}>
      <div className="w-preview">
        <Avatar
          variant="square"
          src={getPreview(!props.original)}
          onClick={tapPreview}
        >
          <Icon fontSize="small">{props.image ? 'image' : 'insert_drive_file'}</Icon>
          {props.value && (
            <Icon
              style={{
                color: '#36D7B7',
                fontSize: 10,
                position: 'absolute',
                top: 1,
                right: 1,
              }}
            >
              check_circle
            </Icon>
          )}
        </Avatar>
      </div>

      <div className="w-cont">
        <div className="w-filename">{file ? file.name : ''}</div>

        <Button
          variant="contained"
          size="small"
          color="secondary"
          disabled={props.disabled}
        >
          Elegir
        </Button>

        <input
          type="file"
          disabled={props.disabled}
          name={props.name}
          accept={props.image ? 'image/*' : props.accept}
          onChange={async e => {
            const file = e.target.files[0];
            if (file) {
              let sizeKb = file.size / 1000;

              // validar tamaño de archivo
              if (props.maxSize && sizeKb > props.maxSize) {
                props.onChange(null);
                setFile(null);
                setPreview(null);
                Toast.error(`Archivo muy pesado, el límite es de ${props.maxSize} KB.`);
              } else {
                setFile(file);
                const data = await upload(file);

                if (data) {
                  props.onChange(data);
                } else {
                  props.onChange(null);
                  setFile(null);
                  return setPreview(null);
                }

                if (file.type.startsWith('image/')) {
                  let reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onloadend = () => {
                    setPreview(reader.result);
                  };
                } else {
                  setPreview('');
                }
              }
            } else {
              props.onChange(null);
              setFile(null);
              setPreview(null);
            }
          }}
        />
      </div>

      {props.label && <div className="w-label">{props.label + (props.required ? ' *' : '')}</div>}
    </div>
  );
}

W.propTypes = {
  value: PropTypes.string,
  endpoint: PropTypes.string,

  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  image: PropTypes.bool,
  original: PropTypes.bool, // imagen original, no rmal en preview
  // tamaño maximo del archivo en KB
  maxSize: PropTypes.number,
  accept: PropTypes.string,
};

W.defaultProps = {
  value: '',
};

export default W;
