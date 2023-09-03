import React from "react";

const Select = ({ name, value, onChange, required, options }) => {
  console.log("current options", options);
  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <select
        className="form-select"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="" disabled hidden>
          Select an option
        </option>
        {options &&
          options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Select;
