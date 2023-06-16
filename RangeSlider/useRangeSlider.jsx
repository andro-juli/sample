import React from "react";

import { constrainNumber } from "@/utils";

export const useRangeSlider = ({ min, max, step, x }) => {
  const [width, setWidth] = React.useState("0");

  function onRangeControlDrag(e) {
    const element = document.getElementById("draggable");
    const parentElem = document.getElementById("clipedPath");

    const elementBoundingClient = element.getBoundingClientRect();
    const parentElementBoundingClient = parentElem.getBoundingClientRect();
    const widthFromLeft =
      elementBoundingClient.left -
      parentElementBoundingClient.x +
      elementBoundingClient.width / 2;

    const percentage =
      (widthFromLeft / parentElementBoundingClient.width) * 100;
    const constrained = constrainNumber(percentage, { min: 0, max: 100 });
    const diff = max - min;
    const factor = (step / diff) * 100;
    const nearestToFactor = Math.round(constrained / factor) * factor;
    setWidth(`${nearestToFactor}%`);
  }

  const getCurrentValue = React.useCallback(
    ({ max, min, step, percentage }) => {
      const new_width = percentage.split("%")[0];
      const val = (new_width * (max - min)) / 100 + min;
      const nearestToFactor = Math.round(val / step) * step;
      return nearestToFactor;
    },
    []
  );

  const moveControl = React.useCallback(
    ({ direction = "pos", shiftKey, ctrlKey }) => {
      const element = document.querySelector("#draggable");
      const new_width = width.split("%")[0];
      //
      let stepAsPercent = step / (max - min);
      if (shiftKey) stepAsPercent = stepAsPercent * 10;
      if (ctrlKey) stepAsPercent = stepAsPercent * 100;
      stepAsPercent = (stepAsPercent * 100).toFixed(4);

      const isNegative = direction === "neg";
      let constrained = constrainNumber(
        +new_width + (isNegative ? -1 : +1) * stepAsPercent,
        {
          min: 0,
          max: 100,
        }
      );
      setWidth(`${constrained}%`);
      const parentElem = document.getElementById("clipedPath");
      const parentElementBoundingClient = parentElem.getBoundingClientRect();
      element.style.transform = x.set(
        (constrained / 100) * parentElementBoundingClient.width
      );
    },
    [max, min, step, width, x, setWidth]
  );

  const handleKeyPress = React.useCallback(
    (event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowRight") {
        moveControl({
          ...event,
          ctrlKey: event.ctrlKey || event.metaKey,
          direction: "pos",
        });
      }
      if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
        moveControl({
          ...event,
          ctrlKey: event.ctrlKey || event.metaKey,
          direction: "neg",
        });
      }
    },
    [moveControl]
  );

  return {
    width,
    setWidth,
    handleKeyPress,
    getCurrentValue,
    onRangeControlDrag,
  };
};
