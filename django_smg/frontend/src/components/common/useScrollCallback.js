import { useEffect } from "react";

const buildThreholdList = (numSteps = 20) => {
  let thresholds = [];

  for (let i = 1.0; i <= numSteps; i++) {
    let ratio = i / numSteps;
    thresholds.push(ratio);
  }

  // thresholds.push(0);
  return thresholds;
};

/**
 * Will call the callback function when the
 */
export const useScrollCallback = (callback, nodeRef, rootNodeRef = null) => {
  const handleIntersect = (entries, observer) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        callback();
        // the callback never should be called more than once, so just
        // disconnect immediately after the first call.
        observer.disconnect();
      }
    });
  };

  useEffect(() => {
    let observer;
    if (nodeRef.current) {
      let options;
      if (rootNodeRef) {
        if (rootNodeRef.current) {
          options = {
            root: rootNodeRef.current,
            rootMargin: "0px",
            threshold: buildThreholdList(1),
          };
        } else {
          // root node has not been assigned yet, let's wait for it
          return null;
        }
      } else {
        options = {
          root: null,
          rootMargin: "0px",
          threshold: buildThreholdList(1),
        };
      }
      observer = new IntersectionObserver(handleIntersect, options);
      observer.observe(nodeRef.current);
    }
    return () => observer && observer.disconnect();
  }, [nodeRef, rootNodeRef]);
};
