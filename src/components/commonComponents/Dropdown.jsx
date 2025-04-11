export default function Dropdown({
    id,
    name,
    options,
    title,
    handleChange,
    selectedValue,
    containerStyle = "",
    inputStyle = "",
    error,
    disabled,
    defaultValueText
}) {
    return (
        <>
            <select className={inputStyle} id={id} name={name} onChange={handleChange}
                value={selectedValue || ""}
                disabled={disabled}
                >
                <option value="" selected disabled hidden>{defaultValueText || `Select ${name}`}</option>
                {options?.map((option,index) => (
                    <option key={index} value={option?.value}>
                        {option?.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-600 text-sm font-medium mt-1 px-1">{error}</p>}
        </>
    );
}