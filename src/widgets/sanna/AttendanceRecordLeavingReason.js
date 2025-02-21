import { Typography } from '@material-ui/core';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Select from 'widgets/fields/FSelect';
import FText from 'widgets/fields/FText';
import Button from 'widgets/sanna/Button';
import Modal from './Modal';

const defaultItem = {
  leaving_id: 0,
  leaving_observation: '',
};

function AttendanceRecordLeavingReason(props) {
  const [item, setItem] = useState(defaultItem);

  React.useEffect(() => {
    if (props.open) setItem(defaultItem);
  }, [props.open]);

  const save = async () => {
    const day = moment().format('YYYY-MM-DD');
    const leaving_time = moment().format('HH:mm:ss');

    const data = {
      day,
      leaving_time,
      ...item
    };

    const response = await Api.patch('/attendance-records/leaving-time', data, 'Cerrando sesión...');
    if (!response.ok) return Alert.error(response.message);

    props.onClosed();
  };

  return (
    <Modal
      open={props.open}
      classNamePaper="w-400 flex flex-col items-center gap-16"
    >
      <div>
        <Typography
          variant="h6"
          align="center"
        >
          Cierre de Sesión
        </Typography>
        <Typography
          variant="body1"
          align="center"
          className="text-12"
        >
          Elije un motivo para cerrar sesión
        </Typography>
      </div>

      <Select
        required
        label="Motivo"
        items={[
          { id: 1, name: 'Cambio de turno' },
          { id: 2, name: 'Ultimo turno del día' },
          { id: 3, name: 'Otros' },
        ]}
        value={item.leaving_id}
        onChange={e => setItem({ leaving_id: e.target.value, leaving_observation: '' })}
      />

      {item.leaving_id === 3 && (
        <FText
          required
          label="Observaciones"
          helperText='Máximo 50 caracteres'
          value={item.leaving_observation}
          onChange={e => setItem({ ...item, leaving_observation: e.target.value })}
          inputProps={{ maxLength: 50 }}
          multiline
          rows={2}
        />
      )}

      <div className="flex gap-16 w-full">
        <Button
          variant="outlined"
          onClick={props.onCancel}
          className="text-black"
          fullWidth
        >
          Volver atrás
        </Button>

        <Button
          onClick={save}
          className="bg-muired hover:bg-muired"
          fullWidth
          disabled={!item.leaving_id || (item.leaving_id === 3 && !item.leaving_observation)}
        >
          Cerrar sesión
        </Button>
      </div>
    </Modal>
  );
}

AttendanceRecordLeavingReason.propTypes = {
  open: PropTypes.bool,
  onClosed: PropTypes.func,
  onCancel: PropTypes.func,
};

AttendanceRecordLeavingReason.defaultProps = {
  open: false,
  onClosed: () => {},
  onCancel: () => {},
};

export default AttendanceRecordLeavingReason;
