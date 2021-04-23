/**
 * Hook which accepts a schema and returns modal components if passed test
 * are met.
 */
import React, { useReducer } from "react";
import { Blanket } from "./blanket";
import { Portal } from "Common/portal";

export const types = { SHOW: "SHOW_NAME", REMOVE: "REMOVE_NAME" };
const reducer = (state, action) => {
  switch (action.type) {
    case types.SHOW:
      return {
        ...state,
        showNamed: [...state.showNamed, action.name],
        passProps: {
          ...state.passProps,
          [action.name]: action.passProps,
        },
      };
    case types.REMOVE:
      return {
        ...state,
        showNamed: state.showNamed.filter((n) => n !== action.name),
      };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
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
  const [state, dispatch] = useReducer(reducer, { showNamed: [] });

  // are not held in state
  const propDependentModals = modals.filter((obj) => !!obj.test);

  // are held in state, and exposed for update via dispatch wrapper
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
    // fire action
    dispatch({
      type: type,
      name: modalName,
      passProps: passProps,
    });
  };

  const dismissedHandler = (obj) => {
    obj.onDismissed ? obj.onDismissed() : null;
    dispatch({
      type: types.REMOVE,
      name: obj.name,
    });
  };

  const returnModals = [
    ...propDependentModals.map((obj, i) => {
      const Component = obj.show;
      return obj.test(props) ? (
        <Portal key={i + Math.random()}>
          <Blanket onDismissed={() => dismissedHandler(obj)}>
            <Component />
          </Blanket>
        </Portal>
      ) : null;
    }),
    ...namedModals.map((obj) => {
      const Component = obj.show;
      return state.showNamed.includes(obj.name) ? (
        <Portal key={obj.name}>
          <Blanket onDismissed={() => dismissedHandler(obj)}>
            <Component {...state.passProps[obj.name]} />
          </Blanket>
        </Portal>
      ) : null;
    }),
  ];

  return [returnModals, dispatchWrapper];
};
