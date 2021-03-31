import React from 'react'

import {EditableRichTile} from './editable_rich_tile'

export default {
  title: 'Editable Rich Tile',
  component: EditableRichTile,
}

const Template = (args) => <EditableRichTile {...args} />

export const Default = Template.bind({})

Default.args = {
  title: 'New title',
  description: 'description',
}
