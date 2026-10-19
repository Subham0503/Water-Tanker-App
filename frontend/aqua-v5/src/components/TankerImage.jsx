import React from "react";
import tankerImage from "../assets/water-tanker.png";

export default function TankerImage({ className = "" }) {
  return <img className={className} src={tankerImage} alt="Water tanker" />;
}
