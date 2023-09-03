import React, { useEffect, useState } from "react";
import Text from "../../components/input/Text";
import DateInput from "../../components/input/Date";
import Select from "../../components/input/Select";
import { addFormData, getFormData } from "./../../helper";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

function FormRenderer({ subviewData, addFieldToForm }) {

    const navigate = useNavigate();

    const { viewname, id } = useParams();

    const fetchAndSetFormData = async () => {
        const toaster = toast.loading();
        const response = await getFormData(viewname, id);
        toast.dismiss(toaster);
        setActualFormData(response);
    };

    useEffect(() => {
        if (id) {
            fetchAndSetFormData();
        }
    }, [id]);

    const [actualFormData, setActualFormData] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        options: "",
        required: false,
        default: "",
    });

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="pt-5">
                <div className="font-bold fs-4">{subviewData.name}</div>
                <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>Add New Field</button>
                <div className="row pt-3">
                    {subviewData.fields && subviewData.fields.length > 0 && subviewData.fields.map((item) => (
                        <React.Fragment key={item.name}>
                            {item.type === "string" ? (
                                <div className="col-6">
                                    <Text value={actualFormData[item.name.toLowerCase()] ?? ""} name={item.name.toLowerCase()} onChange={(e) => { setActualFormData((prev) => ({ ...prev, [e.target.name]: e.target.value })) }} />
                                </div>
                            ) : item.type === "date" ? (
                                <div className="col-6">
                                    <DateInput value={actualFormData[item.name.toLowerCase()] ?? ""} name={item.name.toLowerCase()} onChange={(e) => { setActualFormData((prev) => ({ ...prev, [e.target.name]: e.target.value })) }} />
                                </div>
                            ) : item.type === "select" ? (
                                <div className="col-6">
                                    <Select value={actualFormData[item.name.toLowerCase()] ?? ""} options={item.options} name={item.name.toLowerCase()} onChange={(e) => { setActualFormData((prev) => ({ ...prev, [e.target.name]: e.target.value })) }} />
                                </div>
                            ) : null}
                        </React.Fragment>
                    ))}
                </div>
                {subviewData.fields.length > 0 ? <div className="row pt-3">
                    <button className="btn btn-primary" onClick={async () => {
                        const t = toast.loading();
                        const id = await addFormData(viewname, actualFormData, subviewData);
                        toast.dismiss(t);
                        navigate(`/views/${viewname}/${id}`);
                    }}>Save Data</button>
                </div> : ""}
            </div>
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
                    <div className="btn btn-primary" onClick={async () => {
                        await toast.promise(addFieldToForm({ ...formData, options: formData.options.split(","), subViewName: subviewData.name }), {
                            loading: "Adding data",
                            success: "Data added successfully",
                            error: "Error adding data"
                        });
                        setShowModal(false);
                    }}>
                        Add Field
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default FormRenderer;