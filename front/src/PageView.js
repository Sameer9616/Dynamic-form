import React, { useEffect, useState } from "react";
import ViewRenderer from "./newcomponents/viewrender";
import viewConfig from "./viewConfig";
import { PARSER_KEYS } from "./constants";
import { getSchemaObject, handleCreateView, handleFieldAdd, handleSubViewCreate } from "./helper";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

function PageView() {

    const { viewname } = useParams();
    const [schemaObject, setSchemaObject] = React.useState({});
    const navigate = useNavigate();

    const getAndSetSchemaObject = async () => {
        const res = await getSchemaObject(viewname);
        setSchemaObject(res);
    };

    useEffect(() => {
        if (viewname) {
            getAndSetSchemaObject();
        }
    }, [viewname]);

    const [query, setQuery] = useState("");

    const addFieldToForm = async ({ subViewName, name, type, isRequired, defaultValue, options }) => {
        const subViewIndex = schemaObject.subViews.findIndex(subView => subView.name === subViewName);
        if (subViewIndex >= 0) {
            const newSchemaObject = { ...schemaObject };
            newSchemaObject.subViews[subViewIndex].fields.push({ name, type, required: isRequired, default: defaultValue, options });
            await toast.promise(handleFieldAdd(viewname, subViewName, newSchemaObject.subViews[subViewIndex].type, name, newSchemaObject), {
                loading: "Adding field",
                success: "Field added successfully",
                error: "Error adding field"
            })
            setSchemaObject(newSchemaObject);
        }
    };

    const handleQueryRun = async (currentQuery = "") => {
        if (currentQuery.trim().startsWith(PARSER_KEYS.CREATE_VIEWS.toLowerCase())) {
            const remainQuery = currentQuery.trim().replace(PARSER_KEYS.CREATE_VIEWS.toLowerCase(), "").trim();
            const items = remainQuery.split(" ");
            const viewname = items[0];
            await toast.promise(handleCreateView(viewname), {
                loading: "Creating view",
                success: "views created success",
                error: "failed to create view"
            });
            navigate(`/views/${viewname}`);

        } else if (currentQuery.trim().startsWith(PARSER_KEYS.CREATE_FROM.toLowerCase()) || currentQuery.trim().startsWith(PARSER_KEYS.CREATE_TABLE.toLowerCase())) {
            if (!viewname) {
                toast.error("No view found. Frist create a view");
                return;
            }
            const remainQuery = currentQuery.trim().replace("create", "").trim();
            const items = remainQuery.split(" ");
            const type = items[0];
            const subviewname = items[1];

            //updating schema object 
            const updatedSchema = { ...schemaObject };
            updatedSchema.subViews.push({
                name: subviewname,
                fields: [],
                type: type.toLowerCase(),
                tablename: `${updatedSchema.name.toLowerCase()}_${subviewname.toLowerCase()}`
            });

            await toast.promise(handleSubViewCreate(viewname, subviewname, type.toLowerCase(), updatedSchema), {
                loading: "Creating new subview",
                success: "Subview created successfully",
                error: "Error creating new subview"
            })
            setSchemaObject(updatedSchema);
        } else if (currentQuery.trim().startsWith(PARSER_KEYS.ADD_FIELD)) {
            if (!viewname) {
                toast.error("No view found. Frist create a view");
                return;
            }
            const parsedQuery = currentQuery.trim().replace(PARSER_KEYS.ADD_FIELD, "").trim();
            console.log(parsedQuery);
            const otherOptions = parsedQuery.split(" ");
            const name = otherOptions[0];
            const type = otherOptions[1];
            let options = "";
            if (type === "select") {
                if (!otherOptions[2]) {
                    toast.error("Options are requried for select type");
                    return;
                }
                options = otherOptions[2];
            }

            const updatedSchema = { ...schemaObject };
            const viewIndex = updatedSchema.subViews.findIndex(item => item.type === "form");
            await addFieldToForm({
                subViewName: updatedSchema.subViews[viewIndex].name,
                name: name,
                type: type,
                isRequired: false,
                defaultValue: null,
                options: options
            });
        } else if (currentQuery.trim().startsWith(PARSER_KEYS.ADD_TABLE_FIELD)) {
            if (!viewname) {
                toast.error("No view found. Frist create a view");
                return;
            }
            const parsedQuery = currentQuery.trim().replace(PARSER_KEYS.ADD_TABLE_FIELD, "").trim();
            const otherOptions = parsedQuery.split(" ");
            const tablename = otherOptions[0];
            const name = otherOptions[1];
            const type = otherOptions[2];
            let options = "";
            if (type === "select") {
                if (!otherOptions[3]) {
                    toast.error("Options are requried for select type");
                    return;
                }
                options = otherOptions[2];
            }
            await addFieldToForm({
                subViewName: tablename,
                name: name,
                type: type,
                isRequired: false,
                defaultValue: null,
                options: options
            });
        }
    };

    return <div>
        <div className="">
            <input value={query} type="text" placeholder="Enter Query" onChange={(e) => { setQuery(e.target.value) }} />
            <button className="btn btn-outline-primary" onClick={() => handleQueryRun(query)}>Run Query</button>
        </div>
        <ViewRenderer viewConfig={schemaObject} addFieldToForm={addFieldToForm} />
    </div>;
}

export default PageView;