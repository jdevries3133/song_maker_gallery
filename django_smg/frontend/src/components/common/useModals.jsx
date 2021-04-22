import React, { useReducer } from "react";
import { Blanket } from "./blanket";
import { Portal } from "./portal";

export const types = { SHOW: "SHOW_NAME", REMOVE: "REMOVE_NAME" };
const reducer = (state, action) => {
  switch (action.type) {
    case types.SHOW:
      return {
        ...state,
        [action.name]: {
          isVisible: true,
          props: action.passProps,
        },
      };
      break;
    case types.REMOVE:
      return {
        ...state,
        [action.name]: {
          isVisible: false,
        },
      };
      break;
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
};

/* guard against infinite re-renders */
const shouldDispatch = (modalName, dispatchType, currentState) => {
  switch (dispatchType) {
    case types.SHOW:
      if (currentState[modalName]?.isVisible) return false;
      break;
    case types.REMOVE:
      if (!currentState[modalName]?.isVisible) return false;
      break;
  }
  return true;
};

/**
 * exampleSchema = {
 *  props: props,
 *  modals = [
 *    {
 *              /// For prop-dependent modals ///
 *      test: props => props.thing || props.otherThing === value,
 *      show: MyComponent,
 *      onDismissed?: callbackfn
 *    }
 *    {
 *              /// For component-managed modals ///
 *                  (can be invoked by dispatch)
 *      name: "My Modal",
 *      show: () => <h1>Show me!</h1>,
 *      onDismissed?: callbackfn
 *    }
 *  ]
 * }
 */
export const useModals = ({ modals, props = {} }) => {
  const [state, dispatch] = useReducer(reducer, {});

  // are not held in state
  const propDependentModals = modals.filter((obj) => !!obj.test);

  // are held in state, and exposed for mount/dismount via dispatch wrapper
  const namedModals = modals.filter((obj) => !!obj.name);

  const dispatchWrapper = (modalName, passProps, type = types.SHOW) => {
    // validate that the name passed has been registered in a schema
    const names = namedModals.map((i) => i.name);
    if (!names.includes(modalName)) {
      throw new Error(
        `Invalid modal name passed into useModals dispatch. ${modalName} is ` +
          `not a named modal in your schema.`
      );
    }
    if (shouldDispatch(modalName, type, state)) {
      dispatch({
        type: type,
        name: modalName,
        passProps: passProps,
      });
    }
  };

  const dismissedHandler = (obj) => {
    obj.onDismissed && obj.onDismissed();
    dispatch({
      type: types.REMOVE,
      name: obj.name,
    });
  };

  const returnModals = [
    ...propDependentModals.map((obj, i) => {
      const Component = obj.show;
      return (
        obj.test(props) && (
          <Portal key={i + Math.random()}>
            <Blanket onDismissed={() => dismissedHandler(obj)}>
              <Component {...state[obj.name]?.props} />
            </Blanket>
          </Portal>
        )
      );
    }),

    ...namedModals.map((obj) => {
      const Component = obj.show;
      return (
        state[obj.name]?.isVisible && (
          <Portal key={obj.name}>
            <Blanket onDismissed={() => dismissedHandler(obj)}>
              <Component {...state[obj.name]?.props} />
            </Blanket>
          </Portal>
        )
      );
    }),
  ];

  return [returnModals, dispatchWrapper];
};
