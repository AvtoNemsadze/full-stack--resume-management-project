import React, { useState } from "react";
import { Box, IconButton, Alert } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Delete } from "@mui/icons-material";
import { ICandidate } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import { PictureAsPdf } from "@mui/icons-material";
import { baseUrl } from "../../constants/url.constants";
import EditIcon from "@mui/icons-material/Edit";
import "./candidates-grid.scss";
import CandidateEdit from "./CandidateEdit";

interface ICandidatesGridProps {
  data: ICandidate[];
}

const CandidatesGrid: React.FC<ICandidatesGridProps> = ({ data }) => {
  const [candidates, setCandidates] = useState<ICandidate[]>(data);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [updateCandidate, setUpdateCandidate] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<ICandidate | null>(null);

  // hide modal
  const hideUpdatedForm = () => {
    setUpdateCandidate(false);
  };

  // copy selected value from table row to the modal form
  const handleEdit = (candidate: ICandidate) => {
    setSelectedCandidate(candidate);
    setUpdateCandidate(true);
  };


  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "firstName", headerName: "FirstName", width: 120 },
    { field: "lastName", headerName: "LastName", width: 120 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "coverLetter", headerName: "CV", minWidth: 200, maxWidth: 500 },

    {
      field: "resumeUrl",
      headerName: "Download",
      width: 150,
      renderCell: (params) => (
        <a
          href={`${baseUrl}/Candidate/download/${params.row.resumeUrl}`}
          download
        >
          <PictureAsPdf />
        </a>
      ),
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
    },

    {
      field: "actions",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <IconButton
          aria-label="Delete"
          onClick={() => {
            const candidateName = params.row.firstName;
            if (window.confirm(`Are you sure you want to delete the row with firstName of "${candidateName}"?`)) {
              handleDelete(params.row.id);
            }
          }}
        >
          <Delete />
        </IconButton>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    try {
      const response = await httpModule.delete(`/Candidate/Delete/${id}`);

      const candidateToDelete = candidates.find(
        (candidate) => candidate.id === id
      );

      if (!candidateToDelete) {
        console.error("Company not found");
        return;
      }

      if(response.status === 200) {
        setCandidates((prevCandidate) =>
          prevCandidate.filter((candidate) => candidate.id !== id)
        );

        setSuccessMessage(
          `Candidate with FirstName "${candidateToDelete.firstName}" deleted successfully.`
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        console.error("Error deleting candidate:", response.data);
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", height: 450 }} className="jobs-grid">
      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          {successMessage}
        </Alert>
      )}
      <DataGrid
        rows={candidates}
        columns={columns}
        getRowId={(row) => row.id}
        rowHeight={50}
      />
      {updateCandidate && (
        <CandidateEdit
          hideUpdatedForm={hideUpdatedForm}
          selectedCandidate={selectedCandidate}
          setSuccessMessage={setSuccessMessage}
        />
      )}
    </Box>
  );
};

export default CandidatesGrid;