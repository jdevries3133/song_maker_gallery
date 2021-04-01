import React from 'react'
import {H1} from './styles'
import PropTypes from 'prop-types'

export const EditableRichTile = () => {
  return <H1>EditableRichTile</H1>
}

EditableRichTile.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
  description: PropTypes.string,
}
