import { motion, useDragControls, useMotionValue } from "framer-motion";
import PropTypes from "prop-types";
import React from "react";

import { constrainNumber, formatCurrency } from "@/utils";

import classes from "./Style.module.scss";
import { RangeSvg } from "./Svg";
import { useRangeSlider } from "./useRangeSlider";

export const RangeSlider = ({
  min,
  max,
  type = "number",
  step,
  setAmount = () => {},
}) => {
  const containerEndRef = React.useRef(null);

  const controls = useDragControls();
  const x = useMotionValue(0);
  const { width, handleKeyPress, getCurrentValue, onRangeControlDrag } =
    useRangeSlider({
      min,
      max,
      step,
      x,
    });

  const formatMinMaxValues = (val) => {
    if (!constrainNumber(100, { min: min, max: max })) return;
    return type === "money" ? formatCurrency(val) : val;
  };

  React.useEffect(() => {
    const new_width = width.split("%")[0];
    const val = Math.round((new_width * (max - min)) / 100 + min);
    setAmount(val);
  }, [width, max, min, setAmount]);

  const updateAmount = React.useCallback(() => {
    setAmount(getCurrentValue({ min, max, step, percentage: width }));
  }, [max, min, step, width, getCurrentValue, setAmount]);

  React.useEffect(() => {
    updateAmount();
  }, [updateAmount, width]);

  React.useLayoutEffect(() => {
    const parentElem = document.getElementById("clipedPath");
    const parentProps = parentElem.getBoundingClientRect();
    containerEndRef.current = parentProps.width;
  }, []);

  return (
    <div className={classes.wrap}>
      <p className={classes.minmax}>{formatMinMaxValues(min)}</p>
      <div
        className={classes.slider}
        tabIndex="1"
        onKeyDown={handleKeyPress}
        ref={containerEndRef}
      >
        <motion.div
          className={classes.slider__range}
          id="clipedPath"
          ref={containerEndRef}
          style={{ "--width": width }}
        >
          {RangeSvg}
        </motion.div>
        <motion.div
          drag="x"
          style={{ x }}
          onDrag={onRangeControlDrag}
          dragControls={controls}
          dragTransition={{ velocity: 0 }}
          dragConstraints={{ left: 0, right: containerEndRef.current }}
          dragElastic={0}
          className={classes.slider__range_control}
          id="draggable"
          draggable="true"
        ></motion.div>
      </div>
      <p className={classes.minmax}>{formatMinMaxValues(max)}</p>
    </div>
  );
};

RangeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  type: PropTypes.string,
  step: PropTypes.number,
  setAmount: PropTypes.func,
};
