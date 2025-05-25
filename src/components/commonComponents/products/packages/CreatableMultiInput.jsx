import CreatableSelect from 'react-select/creatable';

export const CreatableMultiInput = ({
  label,
  name,
  options,
  selected,
  onChange,
}) => (
  <div>
    <label className="block font-medium text-gray-700 mb-1">{label}</label>
    <CreatableSelect
      isMulti
      name={name}
      options={options}
      value={selected.map((v) => ({ label: v, value: v }))}
      onChange={(selected) =>
        onChange(name, selected.map((item) => item.value).join(', '))
      }
      placeholder={`Select or type ${label}`}
    />
  </div>
);
