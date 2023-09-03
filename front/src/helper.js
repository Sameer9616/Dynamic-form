const makeRequest = async (query) => {
    const response = await fetch("http://localhost:7000/query", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query
        })
    });
    const data = await response.json();
    return data;
};

export const handleCreateView = async (viewname = "") => {
    const query = `CREATE TABLE ${viewname.toLowerCase()} (prim_id text PRIMARY KEY);`;
    await makeRequest(query);
    const updateViewsTable = `INSERT INTO schemas(id, viewname, schema_object) VALUES ('a${Math.round(Math.random() * 10000000)}', '${viewname.toLowerCase()}', '${JSON.stringify({
        name: viewname,
        subViews: []
    })}');`;
    await makeRequest(updateViewsTable);
}

export const handleSubViewCreate = async (viewname, subviewname, subviewtype, updatedSchema) => {
    const updateSchemaTable = `UPDATE schemas SET schema_object = '${JSON.stringify(updatedSchema)}' WHERE viewname = '${viewname.toLowerCase()}';`;
    await makeRequest(updateSchemaTable);
    if (subviewtype === "form") {
        //do nothing 
    } else if (subviewtype === "table") {
        // create new table 
        const createSubveiewTable = `CREATE TABLE ${viewname.toLowerCase()}_${subviewname.toLowerCase()} (prim_id TEXT PRIMARY KEY, ${viewname.toLowerCase()}_id TEXT, FOREIGN KEY (${viewname.toLowerCase()}_id) REFERENCES ${viewname.toLowerCase()}(prim_id));`;
        await makeRequest(createSubveiewTable);
    }
};

export const handleFieldAdd = async (viewname, subviewname, subviewtype, name, updatedSchema) => {
    const updateSchemaTable = `UPDATE schemas SET schema_object = '${JSON.stringify(updatedSchema)}' WHERE viewname = '${viewname.toLowerCase()}';`;
    await makeRequest(updateSchemaTable);
    if (subviewtype === "form") {
        const updateViewsTable = `ALTER TABLE ${viewname.toLowerCase()} ADD COLUMN ${name.toLowerCase()} VARCHAR(255);`;
        await makeRequest(updateViewsTable);
    } else if (subviewtype === "table") {
        const createFieldQuery = `ALTER TABLE ${viewname.toLowerCase()}_${subviewname.toLowerCase()} ADD COLUMN ${name.toLowerCase()} VARCHAR(255);`;
        await makeRequest(createFieldQuery);
    }
};

export const addFormData = async (viewname, data, subviewobject) => {
    const t = `a${Math.round(Math.random() * 10000000)}`;
    const names = ["prim_id"];
    const values = [];
    values.push(`'${t}'`);
    subviewobject.fields.forEach(field => {
        names.push(`${field.name.toLowerCase()}`);
        values.push(`'${data[field.name.toLowerCase()]}'`);
    });
    const insertQuery = `INSERT INTO ${viewname.toLowerCase()} (${names.join(", ")}) VALUES (${values.join(", ")});`;
    await makeRequest(insertQuery);
    return t;
};

export const addTableData = async (viewname, viewid, data, subviewobject,) => {
    const t = `a${Math.round(Math.random() * 10000000)}`
    const names = [`${viewname.toLowerCase()}_id`, `prim_id`];
    const values = [`'${viewid}'`, `'${t}'`];
    subviewobject.fields.forEach(field => {
        names.push(`${field.name.toLowerCase()}`);
        values.push(`'${data[field.name.toLowerCase()]}'`);
    });
    const insertQuery = `INSERT INTO ${viewname.toLowerCase()}_${subviewobject.name.toLowerCase()} (${names.join(", ")}) VALUES (${values.join(", ")});`;
    await makeRequest(insertQuery);
}

export async function getFormData(viewname, id) {
    const query = `SELECT * FROM ${viewname.toLowerCase()} WHERE prim_id = '${id}';`;
    const response = await makeRequest(query);
    return response.rows[0];
}

export async function getTableData(viewname, subviewname, id) {
    const query = `SELECT * FROM ${viewname.toLowerCase()}_${subviewname.toLowerCase()} WHERE ${viewname.toLowerCase()}_id = '${id}';`;
    const response = await makeRequest(query);
    return response.rows;
}

export async function getSchemaObject(viewname) {
    const query = `SELECT schema_object FROM schemas WHERE viewname = '${viewname.toLowerCase()}';`;
    const response = await makeRequest(query);
    return response.rows[0].schema_object;
}

export async function updateTableData(viewname, subviewname, id, data, subviewobject) {
    const names = [];
    subviewobject.fields.forEach(field => {
        if (field !== "prim_id")
            names.push(`${field.name.toLowerCase()} = '${data[field.name.toLowerCase()]}'`);
    });
    const tableName = `${viewname.toLowerCase()}_${subviewname.toLowerCase()}`
    const updateQuery = `UPDATE ${tableName} SET ${names.join(", ")} WHERE prim_id = '${id}';`;
    await makeRequest(updateQuery);
}