import { useState } from "react";
import { ICreateCompanyDto } from "../../types/global.typing";
import TextField from "@mui/material/TextField/TextField";
import FormControl from "@mui/material/FormControl/FormControl";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import Select from "@mui/material/Select/Select";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Button from "@mui/material/Button/Button";
import { useNavigate } from "react-router-dom";
import httpModule from "../../helpers/http.module";
import "./companies.scss";

const AddCompany = () => {
   const [company, setCompany] = useState<ICreateCompanyDto>({ name: "", size: "" });
   const redirect = useNavigate();

   const handleClickSaveBtn = () => {
      if (company.name === "" || company.size === "") {
         alert("Fill all fields");
         return;
      }
      httpModule
         .post("/Company/Create", company)
         .then((response) => redirect("/companies"))
         .catch((error) => console.log(error));
   };

   const handleClickBackBtn = () => {
      redirect("/companies");
   };

   return (
      <div className="content">
         <div className="add-company">
            <h2>Add New Company</h2>
            <TextField
               autoComplete="off"
               label="Company Name"
               variant="outlined"
               value={company.name}
               onChange={(e) => setCompany({ ...company, name: e.target.value })}
               sx={{
                  minWidth: '500px',
                  '@media (max-width: 600px)': {
                    width: '100%',
                    minWidth: 'unset',
                  },
                }}
            />
            <FormControl fullWidth>
               <InputLabel>Company Size</InputLabel>
               <Select
                  value={company.size}
                  label="Company Size"
                  onChange={(e) => setCompany({ ...company, size: e.target.value })}
               >
                  <MenuItem value="Small">Small</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Large">Large</MenuItem>
               </Select>
            </FormControl>
            <div className="btns" style={{display:'flex', gap:'25px'}}>
               <Button variant="contained" color="success" onClick={handleClickSaveBtn} size="large">
                  Save
               </Button>
               <Button variant="contained" color="error" onClick={handleClickBackBtn} size="large">
                  Back
               </Button>
            </div>
         </div>
      </div>
   );
};

export default AddCompany;
