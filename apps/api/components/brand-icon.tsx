import React from "react";
import img from "../resources/icon.png";
import Image from "next/image";
import {cn} from "@/lib/utils";
const BrandIcon = (props: { className?: string }) => {
  return (
    <Image
      src={img}
      alt="Fastbase"
      className={cn(props.className, "size-10")}
    />
  );
};

export default BrandIcon;
