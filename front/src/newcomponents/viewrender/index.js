import React from "react";
import FormRenderer from "./FormRenderer";
import TableRenderer from "./TableRenderer";

function ViewRenderer({ viewConfig, addFieldToForm }) {
    return (
        <div className="p-4">
            {viewConfig.subViews && viewConfig.subViews.map((subview) => (
                <div key={subview.name}>
                    {subview.type === "form" ? (
                        <FormRenderer
                            subviewData={subview}
                            addFieldToForm={addFieldToForm}
                        />
                    ) : subview.type === "table" ? (
                        <TableRenderer
                            tableview={subview}
                            addFieldToTable={addFieldToForm}
                        />
                    ) : null}
                </div>
            ))}
        </div>
    );
}

export default ViewRenderer;