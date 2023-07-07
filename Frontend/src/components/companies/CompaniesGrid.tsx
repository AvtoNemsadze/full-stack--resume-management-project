import React, { useState } from "react";
import { Box, IconButton, Alert } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import CompanyEdit from "./CompanyEdit";
import { ICompany } from "../../types/global.typing";
import "./companies-grid.scss";
import httpModule from "../../helpers/http.module";

interface ICompaniesGridProps {
  data: ICompany[];
}

const CompaniesGrid: React.FC<ICompaniesGridProps> = ({ data }) => {
  const [companies, setCompanies] = useState<ICompany[]>(data);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [updateCompany, setUpdateCompany] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);

  // hide modal
  const hideUpdatedForm = () => {
    setUpdateCompany(false);
  };

  // copy selected value from table row to the modal form
  const handleEdit = (company: ICompany) => {
    setSelectedCompany(company);
    setUpdateCompany(true);
  };

  //update ui
  const updateCompanyFunc = (updatedCompany: ICompany) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      )
    );
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await httpModule.delete(`/Company/Delete/${id}`);

      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.id !== id)
      );

      // Display success message
      const companyToDelete = companies.find((company) => company.id === id);
      if (companyToDelete) {
        setSuccessMessage(
          `Company with name "${companyToDelete.name}" deleted successfully.`
        );
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        console.error("Company not found");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }

  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      headerClassName: "red-header",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      headerClassName: "red-header",
    },
    {
      field: "size",
      headerName: "Size",
      width: 150,
      headerClassName: "red-header",
    },
    {
      field: "createdAt",
      headerName: "Creation Time",
      width: 200,
      renderCell: (params) => moment(params.row.createdAt).format("YYYY-MM-DD"),
      headerClassName: "red-header"
    },
    {
      field: "update",
      headerName: "Update",
      width: 100,
      renderCell: (params) => (
        <IconButton aria-label="Update" onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </IconButton>
      ),
      headerClassName: "red-header"
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <IconButton
          aria-label="Delete"
          onClick={() => {
            const companyName = params.row.name;
            if (window.confirm(`Are you sure you want to delete the row "${companyName}"?`)) {
              handleDelete(params.row.id);
            }
          }}
        >
          <Delete />
        </IconButton>
      ),
      headerClassName: "red-header"
    },
  ];

  return (
    <Box sx={{ width: "100%", height: 450 }} className="companies-grid">
      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          {successMessage}
        </Alert>
      )}
      <DataGrid
        rows={companies}
        columns={columns}
        getRowId={(row) => row.id}
        rowHeight={50}
      />
      {updateCompany && (
        <CompanyEdit
          hideUpdatedForm={hideUpdatedForm}
          selectedCompany={selectedCompany}
          onSave={updateCompanyFunc}
        />
      )}

      <style>
        {`
        .red-header {
          // background-color: #D14444;
        }
        `}
      </style>
    </Box>
  );
};

export default CompaniesGrid;
