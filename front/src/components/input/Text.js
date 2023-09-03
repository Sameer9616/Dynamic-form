import React from "react";

const Text = ({ name, value, onChange, required }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{name}</label>
      <input
        type="text"
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

export default Text;

// import React, { useState, useEffect } from "react";

// const Text = () => {
//   return (
//     <div className="form-group">
//       <label htmlFor="firstName">Text</label>
//       <input
//         type="text"
//         className="form-control"
//         id="name"
//         name="name"
//         required
//       />
//     </div>
//   );
// };

// export default Text;
