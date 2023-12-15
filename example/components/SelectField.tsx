import { HelperText, Label, Select } from "@roketid/windmill-react-ui";
import React, { useEffect, useState } from "react";

type Props = {
  label: string,
  items: [{}],
  validation: [(string | undefined)?],
  setValue: (value: string) => void,
  valueProp: string,
  value: string,
  textProp: string
}

const SelectField: React.FC<Props> = (props) => {
  return (
    <Label className="mt-4">
      <span >{props.label}</span>
      <Select value={props.value} onChange={(e) => props.setValue(e.target.value)} valid={props.validation.length === 0}>
        {
          props.items?.map((p) => {
            return <option value={p[props.valueProp]}>{p[props.textProp]}</option>
          })
        }
      </Select>
      {
        props.validation &&
        <HelperText valid={false}>{
          props.validation.map((v) => {return <p key={v}>*{v}</p>})
        }</HelperText>
      }
    </Label>
  )
}
export default SelectField