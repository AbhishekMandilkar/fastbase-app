"use client";
import * as motion from "motion/react-client";

import React from "react";

const SmoothMount = (props: { children: JSX.Element }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
      }}
    >
      {props?.children}
    </motion.div>
  );
};

export default SmoothMount;
