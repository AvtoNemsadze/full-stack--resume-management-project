import React, { useState } from "react";
import { Box, IconButton, Alert } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { Delete } from "@mui/icons-material";
import { IJob } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import EditIcon from "@mui/icons-material/Edit";
import JobEdit from "./JobEdit";
import "./jobs-grid.scss";

interface IJobsGridProps {
  data: IJob[];
  handleEdit: () => void,
}

const JobsGrid: React.FC<IJobsGridProps> = ({ data }) => {
  const [jobs, setJobs] = useState<IJob[]>(data);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [showJobModal, setShoJobModal] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);

  const hideJobUpdateForm = () => {
    setShoJobModal(false);
  };

  const handleEditOpenModal = (job: IJob) => {
    setShoJobModal(true);
    setSelectedJob(job);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "level", headerName: "Level", width: 150 },
    { field: "companyName", headerName: "CompanyName", width: 150 },
    {
      field: "createdAt",
      headerName: "Creation Time",
      width: 200,
      renderCell: (params) => moment(params.row.createdAt).fromNow(),
    },


    {
      field: "update",
      headerName: "Update",
      width: 100,
      renderCell: (params) => (
        <IconButton aria-label="Update" onClick={() => handleEditOpenModal(params.row)}>
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
            const jobName = params.row.title;
            if (window.confirm(`Are you sure you want to delete the row with title of "${jobName}"?`)) {
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
      const response = await httpModule.delete(`/Job/Delete/${id}`);
      const jobToDelete = jobs.find((job) => job.id === id);

      if (!jobToDelete) {
        console.error("Company not found");
        return;
      }

      if (response.status === 200) {
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));

        setSuccessMessage(
          `Jobs with title "${jobToDelete.title}" deleted successfully.`
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        console.error("Error deleting job:", response.data);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
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
        rows={jobs}
        columns={columns}
        getRowId={(row) => row.id}
        rowHeight={50}
      />
      {showJobModal && (
        <JobEdit hideJobUpdateForm={hideJobUpdateForm} selectedJob={selectedJob} successMessage={setSuccessMessage}/>
      )}
    </Box>
  );
};

export default JobsGrid;