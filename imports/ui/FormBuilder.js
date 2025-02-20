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
          <label className="fw-bold">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea className="form-control"></textarea>
          ) : (
            <input type={field.type} className="form-control" />
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
    if (label) {
      setFields((prevFields) => [...prevFields, { ...field, label, id: uuidv4() }]);
    }
  };

  const availableFields = [
    { type: "text", label: "Text Input" },
    { type: "email", label: "Email Input" },
    { type: "textarea", label: "Textarea" },
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
          <h4 className="fw-semibold mb-3">Form Builder</h4>
          <DroppableFormArea onDrop={handleDrop} fields={fields} />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
