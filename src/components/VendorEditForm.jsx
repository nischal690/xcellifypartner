import React from 'react'
import steps from '../utils/MultiStepVendorSignupFormData'
import { TextInput } from './commonComponents'
import Dropdown from './commonComponents/Dropdown'

export default function VendorEditForm({
    handleChange,
    fieldValues,
    fields,
    errorMsgs,
    handleOptions,
    handleDisable,
}) {
  return (
    fields.map((field, index)=>(
        <div key={index}
        className="w-full">
          <label
            className="text-lg"
            >{field.label}</label>
          {
            (field.type=='text' || field.type=='url' || field.type=='email' || field.type=='mobile')?
            (<TextInput
            type={field.type}
            name={field.name}
            value={fieldValues[field.name]}
            disabled={handleDisable(field.name)}
            error={errorMsgs[field.name]}
            onChange={handleChange}
            inputStyle="border border-purple-primary rounded-md px-5 py-2 w-full mt-2 focus:border-4 focus:border-purple-300 outline-none"
            />):
            (field.type=='select') &&
            <Dropdown
            name={field.name}
            options={handleOptions(field.name) || field.options}
            defaultValueText={fieldValues[field.name] || `Select ${field.label}`}
            selectedValue={fieldValues[field.name]}
            handleChange={handleChange}
            disabled={handleDisable(field.name)}
            error={errorMsgs[field.name]}
            inputStyle="border border-purple-primary rounded-md px-5 py-2 w-full mt-2 focus:border-4 focus:border-purple-300  outline-none"
            />
            ||(<><input
            type={field.type}
            name={field.name}
            onChange={handleChange}
            className='border border-purple-primary rounded-md px-5 py-2 w-full mt-2 focus:border-4 focus:border-purple-300  outline-none'
            />
            {errorMsgs[field.name] && <p className="text-red-600 text-sm font-medium mt-1 px-1">{errorMsgs[field.name]}</p>}
            </>)
          }
        </div>
      ))
  )
}
