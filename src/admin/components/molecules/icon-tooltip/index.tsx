import React from "react";
import Tooltip, { TooltipProps } from "../../atoms/tooltip";
import IconProps from "../../shared/icons/types/icon-type";
import AlertIcon from "../../shared/icons/alert-icon";
import XCircleIcon from "../../shared/icons/x-circle-icon";
import InfoIcon from "../../shared/icons/info-icon";

type IconTooltipProps = TooltipProps & {
  type?: "info" | "warning" | "error";
} & Pick<IconProps, "size">;

const IconTooltip: React.FC<IconTooltipProps> = ({ type = "info", size = 16, content, ...props }) => {
  const icon = (type: IconTooltipProps["type"]) => {
    switch (type) {
      case "warning":
        return <AlertIcon size={size} className="text-orange-40 flex" />;
      case "error":
        return <XCircleIcon size={size} className="text-rose-40 flex" />;
      default:
        return <InfoIcon size={size} className="text-grey-40 flex" />;
    }
  };

  return (
    <Tooltip content={content} {...props}>
      {icon(type)}
    </Tooltip>
  );
};

export default IconTooltip;
