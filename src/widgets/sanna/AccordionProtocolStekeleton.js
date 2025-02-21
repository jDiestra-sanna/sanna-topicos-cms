import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';

const AccordionProtocolStekeleton = props => {
  const groupItems = new Array(props.countGroups >= 1 ? props.countGroups : 1).fill(true);
  const rowItems = new Array(props.countRows >= 1 ? props.countRows : 1).fill(true);

  return (
    <div className="flex flex-col gap-16">
      {groupItems.map((_, groupIndex) => (
        <div
          key={groupIndex}
          className="p-12"
        >
          {props.grouped && (
            <div>
              <Skeleton
                animation="wave"
                variant="text"
                style={{ width: '200px', height: 40, marginBottom: 16 }}
              />
            </div>
          )}

          <div className="flex flex-col gap-16">
            {rowItems.map((_, index) => (
              <div
                key={index}
                className="flex flex-no-wrap"
              >
                <Skeleton
                  animation="wave"
                  variant="rect"
                  style={{ width: 'calc(100% - 42px)', height: 30, borderRadius: 8 }}
                />

                <Skeleton
                  animation="wave"
                  className="ml-12"
                  variant="circle"
                  width={30}
                  height={30}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

AccordionProtocolStekeleton.propTypes = {
  countGroups: PropTypes.number.isRequired,
  countRows: PropTypes.number.isRequired,
  grouped: PropTypes.bool,
};

AccordionProtocolStekeleton.defaultProps = {
  countGroups: 1,
  countRows: 1,
  grouped: false,
};

export default AccordionProtocolStekeleton;
