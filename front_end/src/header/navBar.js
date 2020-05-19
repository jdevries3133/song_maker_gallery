import React from 'react';

const navBar = props => {

  const elements = props.data.map(group => {

    const group_name = group.pop(0)
    return (
    <a className='a_nav' id={group_name} href={'#' + group_name}><li id={group_name}>{group_name}</li></a>
    )
  })

  return (<ol>{elements}</ol>)
}

export default navBar
