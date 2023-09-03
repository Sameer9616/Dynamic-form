import React from "react";

const Checkbox = ({ name, checkbox, onChange }) => {
  return (
    <div className="form-group form-check">
      <input
        type="checkbox"
        className="form-check-input"
        id={name}
        name={name}
        checked={checkbox}
        onChange={onChange}
      />
      <label className="form-check-label ml-1" htmlFor={name}>
        {name}
      </label>
    </div>
  );
};
export default Checkbox;
