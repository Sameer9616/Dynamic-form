import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Text from '../../components/input/Text';
import DateInput from '../../components/input/Date';
import Select from '../../components/input/Select';
import { addTableData, getTableData, updateTableData } from '../../helper';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function EachTableRow({ viewname, tableRowData, tableview }) {
    const [tableData, setTableData] = useState(tableRowData);
    const handleTableDataUpdate = async () => {
        toast.promise(updateTableData(viewname, tableview.name, tableData["prim_id"], tableData, tableview), {
            success: "Data updated successfully",
            error: "Error updating data",
            loading: "Updating data"
        });
    };
    return (<tr>
        {tableview.fields && tableview.fields.map((field) => {
            {/* return (<td>{tableData[field.name.toLowerCase()]}</td>) */ }
            return (
                <React.Fragment key={field.name} >
                    {
                        field.type === "string" ? (
                            <td>
                                <Text value={tableData[field.name.toLowerCase()] ?? ""} name={field.name.toLowerCase()} onChange={(e) => { setTableData((prev) => ({ ...prev, [e.target.name]: e.target.value })) }} />
                            </td>
                        ) : field.type === "date" ? (
                            <td>
                                <DateInput value={tableData[field.name.toLowerCase()] ?? ""} name={field.name.toLowerCase()} onChange={(e) => { setTableData((prev) => ({ ...prev, [e.target.name]: e.target.value })) }} />
                            </td>

                        ) : field.type === "select" ? (
                            <td>
                                <Select value={tableData[field.name.toLowerCase()] ?? ""} options={field.options} name={field.name.toLowerCase()} onChange={(e) => { setTableData((prev) => ({ ...prev, [e.target.name]: e.target.value })) }} />
                            </td>
                        ) : null
                    }
                </React.Fragment>
            );
        })}
        <td><button onClick={handleTableDataUpdate} className='btn btn-primary'>Save</button></td>
    </tr>)
}

function TableRenderer({ tableview, addFieldToTable }) {

    const { viewname, id } = useParams();

    const fetchDataAndSet = async () => {
        const toaster = toast.loading();
        const response = await getTableData(viewname, tableview.name, id);
        toast.dismiss(toaster);
        setTableData(response);
    };

    useEffect(() => {
        if (id) {
            fetchDataAndSet();
        }
    }, [id]);

    const [tableData, setTableData] = React.useState([]);

    const [addRowData, setAddRowData] = React.useState({});

    const [showAddRowModal, setShowAddRowModal] = React.useState(false);

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        options: "",
        required: false,
        default: "",
    });

    const [showModal, setShowModal] = useState();

    return (
        <>
            <div className='pt-5'>
                <div className="font-bold fs-4">{tableview.name}</div>
                <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>Add New Field</button>
                <button className="btn btn-primary ms-2" onClick={() => setShowAddRowModal(true)}>Add Data</button>
                <table class="table">
                    <thead>
                        <tr>
                            {tableview.fields && tableview.fields.map((item) => (
                                <th key={item.name}>{item.name}</th>
                            ))}
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item) => {
                            return <EachTableRow tableRowData={item} viewname={viewname} tableview={tableview} />
                        })}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={showAddRowModal} toggle={() => setShowAddRowModal(false)}>
                <ModalHeader toggle={() => setShowAddRowModal(false)}>Add New Field</ModalHeader>
                <ModalBody>
                    <div className="row">
                        {tableview.fields && tableview.fields.map((item) => (
                            <React.Fragment key={item.name}>
                                {item.type === "string" ? (
                                    <div className="col-6">
                                        <Text value={addRowData[item.name.toLowerCase()] ?? ""} name={item.name.toLowerCase()} onChange={(e) => { setAddRowData((prev) => ({ ...prev, [e.target.name]: e.target.value })) }} />
                                    </div>
                                ) : item.type === "date" ? (
                                    <div className="col-6">
                                        <DateInput value={addRowData[item.name.toLowerCase()] ?? ""} name={item.name.toLowerCase()} onChange={(e) => { setAddRowData((prev) => ({ ...prev, [e.target.name]: e.target.value })) }} />
                                    </div>
                                ) : item.type === "select" ? (
                                    <div className="col-6">
                                        <Select value={addRowData[item.name.toLowerCase()] ?? ""} options={item.options} name={item.name.toLowerCase()} onChange={(e) => { setAddRowData((prev) => ({ ...prev, [e.target.name]: e.target.value })) }} />
                                    </div>
                                ) : null}
                            </React.Fragment>
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter className="">
                    <div className="btn btn-primary" onClick={() => {
                        toast.promise(addTableData(viewname, id, addRowData, tableview), {
                            loading: "Adding data",
                            success: "Data added successfully",
                            error: "Error adding data"
                        });
                        setShowAddRowModal(false);
                        tableData.push(addRowData);
                    }}>
                        Add Data
                    </div>
                </ModalFooter>
            </Modal>
            <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
                <ModalHeader toggle={() => setShowModal(false)}>Add New Field</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-6 pt-2">
                            <label>
                                Name*
                            </label>
                            <input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} type="text" className="form-control" />
                        </div>
                        <div className="col-6 pt-2">
                            <label>
                                Type*
                            </label>
                            <select class="form-select" value={formData.type} onChange={(e) => setFormData(prev => ({
                                ...prev, type: e.target.value
                            }))}>
                                <option selected>Open this select menu</option>
                                <option value="string">String</option>
                                <option value="date">Date</option>
                                <option value="select">Select</option>
                            </select>
                        </div>
                        <div className="col-6 pt-2">
                            <label>
                                Options (Comma Seperated)
                            </label>
                            <input value={formData.item} onChange={(e) => setFormData(prev => ({ ...prev, options: e.target.value }))} type="text" className="form-control" />
                        </div>
                        <div className="col-6 pt-2">
                            <label>
                                Required
                            </label>
                            <div>
                                <input onChange={() => setFormData(prev => ({ ...prev, required: !prev.required }))} checked={formData.required} type="checkbox" />
                            </div>
                        </div>
                        <div className="col-6 pt-2">
                            <label>
                                Default Value</label>
                            <input value={formData.default} onChange={(e) => setFormData(prev => ({ ...prev, default: e.target.value }))} type="text" className="form-control" />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="">
                    <div className="btn btn-primary" onClick={() => {
                        addFieldToTable({ ...formData, options: formData.options.split(","), subViewName: tableview.name });
                        setShowModal(false);
                    }}>
                        Add Field
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default TableRenderer;