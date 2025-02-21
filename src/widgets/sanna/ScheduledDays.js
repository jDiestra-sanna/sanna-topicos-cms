import React from 'react';
import PropTypes from 'prop-types';
import EventNoteOutlinedIcon from '@material-ui/icons/EventNoteOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import { Button, Checkbox } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import ScheduledDaysItem from './ScheduledDaysRow';
import Alert from 'inc/Alert';

function ScheduledDays(props) {
  const [allChecked, setAllChecked] = React.useState(false);
  const [selectedDays, setSelectedDays] = React.useState([]);

  return (
    <div className={clsx('p-16 rounded-8 border-4 border-grey-200', props.containerClassName)}>
      <div className="mb-8 flex justify-between">
        <div className="flex items-center">
          {!props.readyOnly && (
            <div aria-label="wrapper all checked">
              <Tooltip title="Marcar todos">
                <Checkbox
                  disabled={props.items.length === 0}
                  style={{ width: 30, height: 30 }}
                  checked={allChecked}
                  onChange={() => {
                    const checked = !allChecked;
                    const selected = checked ? props.items.map(item => item.id) : [];

                    setAllChecked(checked);
                    setSelectedDays(selected);
                    props.onSelectDays(selected);
                  }}
                />
              </Tooltip>
            </div>
          )}
          <div>
            <EventNoteOutlinedIcon color="primary" />
            <span className="ml-12">{props.title}</span>
          </div>
        </div>
        <div>
          {!props.readyOnly && (
            <Button
              disabled={selectedDays.length === 0}
              startIcon={<DeleteIcon />}
              onClick={() => {
                Alert.confirm('¿Estas seguro de eliminar los días seleccionados?', () => {
                  props.onDelete(selectedDays);
                  setSelectedDays([]);
                  setAllChecked(false);
                });
              }}
            >
              Eliminar
            </Button>
          )}
        </div>
      </div>

      <div className={clsx('flex flex-col gap-8', props.itemsContainerClassName)}>
        {props.items.map((item, index) => {
          const itemChecked = selectedDays.includes(item.id);

          return (
            <ScheduledDaysItem
              key={index}
              item={item}
              readOnly={props.readyOnly}
              checked={itemChecked}
              onCheck={() => {
                const selected = itemChecked ? selectedDays.filter(id => id !== item.id) : [...selectedDays, item.id];

                if (props.items.length === selected.length) {
                  setAllChecked(true);
                } else {
                  setAllChecked(false);
                }

                setSelectedDays(selected);
                props.onSelectDays(selected);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

ScheduledDays.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      leavingTime: PropTypes.string.isRequired,
      entryTime: PropTypes.string.isRequired,
      day: PropTypes.string.isRequired,
      totalTime: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSelectDays: PropTypes.func,
  onDelete: PropTypes.func,
  containerClassName: PropTypes.string,
  itemsContainerClassName: PropTypes.string,
  readyOnly: PropTypes.bool,
  title: PropTypes.string,
};

ScheduledDays.defaultProps = {
  onDelete: selectedIds => {},
  onSelectDays: selectedIds => {},
  title: 'Programado para el:',
};

export default ScheduledDays;
