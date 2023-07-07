import React, { useState } from "react";
import "./jobs-grid.scss";
import { ICompany, IJob } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";

interface JobEditProps {
  hideJobUpdateForm: () => void;
  selectedJob: IJob | null;
  successMessage: (message: string) => void;
}

const JobEdit: React.FC<JobEditProps> = ({ hideJobUpdateForm, selectedJob, successMessage }) => {
  const [jobTitle, setJobTitle] = useState(selectedJob?.title);
  const [jobLevel, setJobLevel] = useState(selectedJob?.level);
  const [companyName, setCompanyName] = useState(selectedJob?.companyId);

  // get company
  const [companies, setCompanies] = useState<ICompany[]>([]);

  React.useEffect(() => {
    httpModule
      .get<IJob[]>("/Company/get")
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const levelsArray: string[] = [
    "Intern",
    "Junior",
    "MidLevel",
    "Senior",
    "TeamLead",
    "Cto",
    "Architect",
  ];

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedJob = {
      id: selectedJob?.id || "",
      title: jobTitle || "",
      level: jobLevel || "",
      companyId: companyName || null,
    };

    if (jobTitle === "") {
      alert("please fill all fields");
      return false;
    }

    httpModule
      .put(`/Job/Update/${updatedJob.id}`, updatedJob)
      .then((response) => {
        hideJobUpdateForm();
        successMessage(`job with title of ${selectedJob?.title} updated successfully`)

        setTimeout(()=>{
            window.location.reload();
            successMessage(null);
        },2000);
      })
      .catch((error) => console.log(error));
  };

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
          height: "420px",
          padding: "4rem",
          width: "500px",
          borderRadius: "4px",
        }}
      >
        <div className="job-update-form-title">
          <p>Update Job</p>
        </div>

        <form
          onSubmit={handleSave}
          className="job-update-form"
          style={{ marginTop: "15px" }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="jobTitle">
              Job Title <br />
            </label>
            <input
              type="text"
              id="jobTitle"
              name="title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="jobLevel">Job Level</label>
            <select
              id="jobLevel"
              name="level"
              value={jobLevel}
              onChange={(e) => setJobLevel(e.target.value)}
            >
              {levelsArray.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="companyId">Company</label>
            <select
              id="companyId"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            >
              {companies.length > 0 ? (
                companies.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              ) : (
                <option value="">Loading...</option>
              )}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button type="submit">Save</button>
            <button type="button" onClick={hideJobUpdateForm}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      <style>
        {` 
          .job-update-form-title{
            position: absolute;
            margin-top: -40px;
          }
          .job-update-form-title p{
            font-size:22px;
            font-weight:600;
          }
          `}
      </style>
    </div>
  );
};

export default JobEdit;
