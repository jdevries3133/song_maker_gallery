import React, { useReducer, useRef } from "react";
import { Blanket } from "./blanket";

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
  // we need to dispatch if the modal is not present in state at all yet.
  if (!(modalName in currentState)) return true;
  switch (dispatchType) {
    case types.SHOW:
      if (currentState[modalName]?.isVisible) {
        // console.log(
        //   `${modalName} is already ${currentState[modalName]}, so the dispatcher will not fire.`,
        //   currentState
        // );
        return false;
      }
    case types.REMOVE:
      if (!currentState[modalName]?.isVisible) {
        // console.log(
        //   `${modalName} is already ${currentState[modalName]}, so the dispatcher will not fire.`,
        //   currentState
        // );
        return false;
      }
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

  // ngl, I still have a tenuous grasp on why this is necessary
  // https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function
  const stateRef = useRef();
  stateRef.current = state;

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
    if (shouldDispatch(modalName, type, stateRef.current)) {
      dispatch({
        type: type,
        name: modalName,
        passProps: passProps,
      });
    }
  };

  const dismissedHandler = (obj) => {
    obj.onDismissed && obj.onDismissed();
    if (namedModals.includes(obj.name)) {
      dispatch({
        type: types.REMOVE,
        name: obj.name,
      });
    }
  };

  const returnModals = [
    ...propDependentModals.map((obj, i) => {
      const Component = obj.show;
      return (
        obj.test(props) && (
          <Blanket
            key={i + Math.random()}
            onDismissed={() => dismissedHandler(obj)}
          >
            <Component {...state[obj.name]?.props} />
          </Blanket>
        )
      );
    }),

    ...namedModals.map((obj, i) => {
      const Component = obj.show;
      return (
        state[obj.name]?.isVisible && (
          <Blanket
            key={i + Math.random()}
            onDismissed={() => dismissedHandler(obj)}
          >
            <Component {...state[obj.name]?.props} />
          </Blanket>
        )
      );
    }),
  ];

  return [returnModals, dispatchWrapper, state];
};
