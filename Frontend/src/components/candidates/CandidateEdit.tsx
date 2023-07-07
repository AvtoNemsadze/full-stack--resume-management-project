import React, { ChangeEvent, useState } from "react";
import { ICandidate, IJob } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import "./candidates-grid.scss";


interface CandidateEditProps {
  hideUpdatedForm: () => void;
  selectedCandidate: ICandidate | null;
  setSuccessMessage: (message: string) => void;
}

const CandidateEdit: React.FC<CandidateEditProps> = ({hideUpdatedForm, selectedCandidate, setSuccessMessage }) => {
  const [pdfFile, setPdfFile] = useState<File | null>();

  const [candidate, setCandidate] = useState({
    firstName: selectedCandidate?.firstName ?? "",
    lastName: selectedCandidate?.lastName ?? "",
    email: selectedCandidate?.email ?? "",
    phone: selectedCandidate?.phone ?? "",
    coverLetter: selectedCandidate?.coverLetter ?? "",
    resumeUrl: selectedCandidate?.resumeUrl ?? "",
    jobId: selectedCandidate?.jobId ?? "",
    candidateId: selectedCandidate?.id ?? "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setCandidate({ ...candidate, [name]: value });
  };
  
  // get job
  const [jobs, setJobs] = useState<IJob[]>([]);
  React.useEffect(() => {
    httpModule
      .get<IJob[]>("/Job/Get")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });
  }, []);

  // update candiate
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      candidate.firstName === "" ||
      candidate.lastName === "" ||
      candidate.email === "" ||
      candidate.phone === "" ||
      candidate.coverLetter === "" ||
      candidate.jobId === "" ||
      !pdfFile
    ) {
      alert("Fill all fields");
      return;
    }

    const newCandidateFormData = new FormData();
      newCandidateFormData.append("firstName", candidate.firstName);
      newCandidateFormData.append("lastName", candidate.lastName);
      newCandidateFormData.append("email", candidate.email);
      newCandidateFormData.append("phone", candidate.phone);
      newCandidateFormData.append("coverLetter", candidate.coverLetter);
      newCandidateFormData.append("jobId", candidate.jobId);
      newCandidateFormData.append("pdfFile", pdfFile);

    httpModule
      .put(`/Candidate/Update/${candidate.candidateId}`, newCandidateFormData)
      .then(() => {
        hideUpdatedForm();
        setSuccessMessage(
          `Candidate with FirstName "${candidate.firstName}" updated successfully.`
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

        setTimeout(() => {
          location.reload();
        }, 3000);
      });
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
        bottom: "20px",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          maxHeight: "750px",
          padding: "4rem",
          width: "650px",
          borderRadius: "4px",
          marginLeft:"20px",
          marginRight:"20px"
        }}
      >
        <div className="candidate-update-form-title">
          <p>Update Candidate</p>
        </div>

        <form onSubmit={handleSave} className="candidate-update-form" style={{ marginTop: "15px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="candidateJob">Job</label>
            <select
              id="candidateJob"
              name="jobId"
              value={candidate.jobId}
              onChange={handleChange}
            >
              {jobs.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="candidateFirstName">
              First Name <br />
            </label>
            <input
              type="text"
              id="candidateFirstName"
              name="firstName"
              value={candidate.firstName}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="candidateLastName">
              Last Name <br />
            </label>
            <input
              type="text"
              id="candidateLastName"
              name="lastName"
              value={candidate.lastName}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="candidateEmail">
              Email <br />
            </label>
            <input
              type="text"
              id="candidateEmail"
              name="email"
              value={candidate.email}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="candidatePhone">
              Phone <br />
            </label>
            <input
              type="text"
              id="candidatePhone"
              name="phone"
              value={candidate.phone}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="candidateCV">
              CV
              <br />
            </label>
            <input
              type="text"
              id="candidateCV"
              name="coverLetter"
              value={candidate.coverLetter}
              onChange={handleChange}
            />
          </div>

          <div style={{ paddingBottom: "40px" }}>
            <input
              type="file"
              onChange={(event) =>
                setPdfFile(event.target.files ? event.target.files[0] : null)
              }
              style={{
                padding: "10px",
                backgroundColor: "#f0f0f0",
                color: "#333",
                border: "none",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            />
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <button type="submit">Save</button>
            <button type="button" onClick={hideUpdatedForm}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style>
        {
          ` 
          .candidate-update-form-title{
            position: absolute;
            margin-top: -40px;
          }
          .candidate-update-form-title p{
            font-size:22px;
            font-weight:600;
          }
          `
        }
      </style>
    </div>
  );
};

export default CandidateEdit;
