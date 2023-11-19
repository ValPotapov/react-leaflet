import React from 'react'
import { SvgIcon } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';


interface TypeIconPointProps extends SvgIconProps {
  className?: string;
  size?: string;
}

export const IconPoint: React.FC<TypeIconPointProps> = (props) => {
  const { color, className, size, ...restProps } = props;

  return (
    <SvgIcon className={props.className}{...restProps}>
      <svg
        stroke="currentColor"
        fill={props.color || "currentColor"}
        height="100" width="100"
        strokeWidth="0"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
      </svg>
    </SvgIcon>
  )
}



