import React from 'react';

import './header.css';
import DefaultDescription from './defaultDescription';

const header = props  => {

  return (
    <div>
      <h1>{props.title}</h1>
      <div className='description'>
      <DefaultDescription />
        <p><b>Hover over the picture of a students' work to see their name, and click to open their composition in a new tab</b></p>
      </div>
    </div>
  )
};

export default header
