import React from 'react';

import Tile from './tile';
import './tilegrid.css';

const tileGrid = props => {

  const group_name = props.data.pop(0)

  return (
    <div>
    <div className='tg_top_space' />
      <a href='#top'>
        <h2 className='tg_title' name={group_name}>{group_name}</h2>
        <br />
        <span className="back_finger">☟</span>
      </a>
      <ul className='tgrid'>
        {
          props.data.map((student, index) => (
            <Tile
              group={group_name}
              st_arr={student}
              id={group_name + student}
              index={index} />
            )
          )
        }
      </ul>
    </div>
  )
};

export default tileGrid;
