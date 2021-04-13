export const types = { TOGGLE: "TOGGLE", DISABLE: "DISABLE", ENABLE: "ENABLE" };
export const configItemReducer = (state, action) => {
  switch (action.type) {
    case types.TOGGLE:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          checked: !state[action.id].checked,
        },
      };
    case types.DISABLE:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          enabled: false,
        },
      };
    case types.ENABLE:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          enabled: true,
        },
      };
  }
};
