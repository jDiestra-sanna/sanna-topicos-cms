import React from 'react';
import { Card, CardContent } from '@material-ui/core';
import PropTypes from 'prop-types';

function CardContainer(props) {
  return (
    <Card className={props.cardClassName}>
      <CardContent className={props.cardContentClassName}>{props.children}</CardContent>
    </Card>
  );
}

CardContainer.propTypes = {
  cardClassName: PropTypes.string,
  cardContentClassName: PropTypes.string,
};

CardContainer.defaultProps = {
  cardClassName: 'rounded-16',
  cardContentClassName: 'p-24',
};

export default CardContainer;
