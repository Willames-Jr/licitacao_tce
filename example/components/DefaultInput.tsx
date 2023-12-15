import { HelperText, Input, Label, Select } from "@roketid/windmill-react-ui";
import React from "react";

type Props = {
  label: string,
  validation: [(string | undefined)?],
  setValue: (value: string) => void,
  value: string,
  maxLength: number,
  type?: string
}

const DefaultInput: React.FC<Props> = (props) => {
  return(
    <Label className="mt-4">
      <span>{props.label}</span>
      <Input 
        type={!props.type ? "text" : props.type} 
        value = {props.value} 
        maxLength={props.maxLength} 
        onChange={(e) => props.setValue(e.target.value)} 
        className="mt-1" 
        valid={props.validation.length === 0}  
      />
      {
        props.validation &&
        <HelperText valid={false}>{props.validation.map((v) => {return <p>*{v}</p>})}</HelperText>
      }
    
    </Label>
  )
}

export default DefaultInput;