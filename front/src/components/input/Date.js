import React from "react";

const DateInput = ({ name, value, onChange, required }) => {
  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <input
        type="date"
        className="form-control"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default DateInput;

// import React from "react";

// const Date = () => {
//   return (
//     <div>
//       <label htmlFor="dob">Date of Birth</label>
//       <input
//         type="date"
//         className="form-control"
//         id="dob"
//         name="dob"
//         required
//       />
//     </div>
//   );
// };

// export default Date;
