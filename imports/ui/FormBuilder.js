import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";

const ItemTypes = { FIELD: "field" };

const DraggableField = ({ field }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FIELD,
    item: { field },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 bg-white border rounded shadow-sm text-center ${isDragging ? "opacity-50" : "hover-shadow"}`}
      style={{ cursor: "grab" }}
    >
      {field.label}
    </div>
  );
};

const DroppableFormArea = ({ onDrop, fields }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.FIELD,
    drop: (item) => onDrop(item.field),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`border p-4 rounded ${isOver ? "bg-light" : "bg-white"}`}
      style={{ minHeight: "300px" }}
    >
      {fields.length === 0 && <p className="text-muted">Drag elements here...</p>}
      {fields.map((field) => (
        <div key={field.id} className="mb-3">
          <label className="fw-bold">
            {field.label} {field.required && <span className="text-danger">*</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea className="form-control" required={field.required}></textarea>
          ) : field.type === "select" ? (
            <select className="form-control" required={field.required}>
              {field.options.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input type={field.type} className="form-control" required={field.required} />
          )}
        </div>
      ))}
      {fields.length > 0 && <button className="btn btn-primary mt-3">Submit</button>}
    </div>
  );
};

const FormBuilder = () => {
  const [fields, setFields] = useState([]);

  const handleDrop = (field) => {
    const label = prompt("Enter label for this field:", field.label);
    if (!label) return;

    const isRequired = window.confirm("Is this field required?");

    const newField = { ...field, label, required: isRequired, id: uuidv4() };

    // If it's a select field, ask for options
    if (field.type === "select") {
      const optionsInput = prompt("Enter comma-separated options:", "Option 1, Option 2, Option 3");
      newField.options = optionsInput ? optionsInput.split(",").map(opt => opt.trim()) : [];
    }

    setFields((prevFields) => [...prevFields, newField]);
  };

  const availableFields = [
    { type: "text", label: "Text Input" },
    { type: "email", label: "Email Input" },
    { type: "textarea", label: "Textarea" },
    { type: "date", label: "Date Input" },
    { type: "select", label: "Dropdown", options: ["Option 1", "Option 2", "Option 3"] },
  ];

  return (
    <div className="container mt-4">
      <div className="row g-4">
        <div className="col-md-4">
          <h4 className="fw-semibold mb-3">Drag Elements</h4>
          <div className="d-grid gap-2">
            {availableFields.map((field, index) => (
              <DraggableField key={index} field={field} />
            ))}
          </div>
        </div>
        <div className="col-md-8">
          <h4 className="fw-semibold mb-3">Contact Form Builder</h4>
          <DroppableFormArea onDrop={handleDrop} fields={fields} />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
