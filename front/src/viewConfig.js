export const viewConfig = {
  id: "view1",
  name: "Sample View",
  subViews: [
    {
      name: "Form Subview",
      type: "form",
      fields: [
        {
          name: "Name",
          type: "string",
          required: true,
        },
        {
          name: "Age",
          type: "number",
          required: true,
        },
        {
          name: "Birthdate",
          type: "date",
          required: false,
        },
        {
          name: "Is Active",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "Country",
          type: "select",
          required: false,
          options: ["USA", "Canada", "UK", "Australia"],
        },
      ],
    },
    {
      name: "Table Subview",
      type: "table",
      tablename: "SampleTable",
      fields: [
        {
          name: "ID",
          type: "number",
        },
        {
          name: "Name",
          type: "string",
        },
        {
          name: "Date Created",
          type: "date",
        },
      ],
    },
  ],
};

export default viewConfig;
