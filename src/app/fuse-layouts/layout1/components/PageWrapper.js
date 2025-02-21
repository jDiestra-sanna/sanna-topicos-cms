import React from 'react';
import { Box } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';

function PageWrapper(props) {
  const { className, ...result } = props;

  return (
    <div
      aria-label="page-wrapper"
      className={clsx('min-h-full overflow-auto bg-grey-200 font-stagsans py-48 px-96', className)}
      {...result}
    >
      {props.children}
    </div>
  );
}

export default PageWrapper;
