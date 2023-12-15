import { HelperText, Label } from "@roketid/windmill-react-ui";
import React, { useEffect, useState } from "react";
import Select from 'react-select';

type Props = {
  label: string,
  items: any,
  validation: any,
  setValue: (value: string) => void,
  valueProp: string,
  value: string,
  textProp: string
}

const SelectField: React.FC<Props> = (props) => {
  const [elements, setElements] = useState([{}]);
  const [value, setValue] : [value:any, setValue:any] = useState(null);
  useEffect(() => {
    if (props.value === value) return;
    setValue(elements.find((e: any) => e.value === props.value))
  },[props.value])

  useEffect(() => {
    
    setElements(props.items.map((i: any) => {
      return {label: i[props.textProp], value: i[props.valueProp]}
    }))
    
  },[])
  return (
    <Label className="mt-4">
      <span>{props.label}</span>
      <Select 
        isClearable
        className="mt-1"
        options={elements}
        value={value}
        onChange={(opt:{value:string,label:string}) => props.setValue(opt?.value)}
      />
      {
        props.validation &&
        <HelperText valid={false}>{
          props.validation.map((v: any) => {return <p key={v}>*{v}</p>})
        }</HelperText>
      }
    </Label>
  )
}
export default SelectField