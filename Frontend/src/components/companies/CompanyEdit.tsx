import React, { useState } from "react";
import "./companies-grid.scss";
import { ICompany } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";

interface CompanyEditProps {
  hideUpdatedForm: () => void;
  selectedCompany: ICompany | null;
  onSave: any
}

const CompanyEdit: React.FC<CompanyEditProps> = ({ hideUpdatedForm, selectedCompany, onSave }) => {
  const [companyName, setCompanyName] = useState(selectedCompany?.name ?? "");
  const [size, setSize] = useState(selectedCompany?.size ?? "");

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const updatedCompany = {
      id: selectedCompany?.id,
      name: companyName,
      size: size,
    };
  
    if(companyName === ""){
      alert("please fill all fields")
      return false;
    }

    httpModule
      .put(`/Company/Update/${updatedCompany.id}`, updatedCompany)
      .then((response) => {
        onSave(updatedCompany);
        hideUpdatedForm();
      })
      .catch((error) => console.log(error));
  };


  const sizes = ["Small", "Medium", "Large"];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          height: "330px",
          padding: "4rem",
          width: "500px",
          borderRadius: "4px",
        }}
      >
        <form onSubmit={handleSave} className="company-update-form">
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="companyName">Company Name <br /></label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="size">Size</label>
            <select
              id="size"
              name="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {sizes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button type="submit">
              Save
            </button>
            <button type="button" onClick={hideUpdatedForm}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyEdit;