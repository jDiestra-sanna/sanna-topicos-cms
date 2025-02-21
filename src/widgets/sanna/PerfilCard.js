import { Avatar, Checkbox, Typography } from '@material-ui/core';
import CallOutlinedIcon from '@material-ui/icons/CallOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import PropTypes from 'prop-types';
import React from 'react';

function PerfilCard(props) {
  return (
    <div className="bg-grey-200 rounded-8 p-20">
      <div>
        <div className="flex mb-24">
          <Avatar
            aria-label="recipe"
            className="h-56 w-56 mr-24"
          >
            {props.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex flex-col justify-center">
            <Typography
              variant="h6"
              className="text-16"
            >
              {props.name.charAt(0).toUpperCase()}
              {props.name.slice(1)}
            </Typography>
            <Typography
              variant="subtitle1"
              className="text-14"
            >
              {props.role}
            </Typography>
          </div>
          <div className="flex-1 flex justify-end items-center">
            {props.status === 'attending' ? (
              <span className="inline-block py-8 px-16 bg-muiprimary text-white font-medium rounded-8">Atendiendo</span>
            ) : props.status === 'absent' ? (
              <span className="inline-block py-8 px-16 bg-muired text-white font-medium rounded-8">Ausente</span>
            ) : props.status === 'scheduled' ? (
              <span className="inline-block py-8 px-16 bg-muisecondary text-white font-medium rounded-8">
                Programado
              </span>
            ) : props.status === 'not-scheduled' ? (
              <span className="inline-block py-8 px-16 bg-grey-300 font-medium rounded-8">No Programado</span>
            ) : (
              <span />
            )}
          </div>
        </div>
        <div
          className="flex flex-wrap"
          style={{ columnGap: '36px' }}
        >
          <div className="flex items-center">
            <CallOutlinedIcon color="secondary" />
            <span className="ml-12">{props.phone}</span>
            {props.seePhoneCheckBox && (
              <Checkbox
                checked={props.seePhoneCheckBox.value}
                onChange={props.seePhoneCheckBox.onChange}
              />
            )}
          </div>
          <div className="flex items-center">
            <EmailOutlinedIcon color="secondary" />
            <span className="ml-12">{props.email}</span>
            {props.seeEmailCheckBox && (
              <Checkbox
                checked={props.seeEmailCheckBox.value}
                onChange={props.seeEmailCheckBox.onChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

PerfilCard.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  operating: PropTypes.bool,
  status: PropTypes.oneOfType(['scheduled', 'absent', 'attending', 'not-scheduled', undefined]),
  seePhoneCheckBox: PropTypes.shape({
    value: PropTypes.bool,
    onChange: PropTypes.func,
  }),
  seeEmailCheckBox: PropTypes.shape({
    value: PropTypes.bool,
    onChange: PropTypes.func,
  }),
};

export default PerfilCard;
