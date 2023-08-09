using AutoMapper;
using Backend.Core.Context;
using Backend.Core.Dtos.Candidate;
using Backend.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private ApplicationDbContext _context { get; }
        public IMapper _mapper { get; set; }

        public CandidateController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateCandidate([FromForm] CandidateCreateDto dto, IFormFile pdfFile)
        {
            var fiveMegaByte = 5 * 1024 * 1024;
            var pdfMimeType = "application/pdf";

            if(pdfFile.Length > fiveMegaByte || pdfFile.ContentType != pdfMimeType)
            {
                return BadRequest("this is not valid file");
            }

            var resumeUrl = Guid.NewGuid().ToString() + ".pdf";
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Documents", "pdfs", resumeUrl);

            using(var stream = new FileStream(filePath, FileMode.Create))
            {
                await pdfFile.CopyToAsync(stream);
            }

            var newCandidate = _mapper.Map<Candidate>(dto);
            newCandidate.ResumeUrl = resumeUrl;

            await _context.Candidates.AddAsync(newCandidate);   
            await _context.SaveChangesAsync();

            return Ok("Candidate Saved Successfully");
        }


        // not finished ???
        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateCandidate(long id, [FromForm] CandidateUpdateDto dto, IFormFile pdfFile)
        {
            var existingCandidate = await _context.Candidates.FindAsync(id);

            if (existingCandidate == null)
            {
                return NotFound("Candidate not found");
            }

            var fiveMegaByte = 5 * 1024 * 1024;
            var pdfMimeType = "application/pdf";

            // Update the PDF file if a new file is provided
            if (pdfFile != null)
            {
                if (pdfFile.Length > fiveMegaByte || pdfFile.ContentType != pdfMimeType)
                {
                    return BadRequest("Invalid PDF file");
                }

                var resumeUrl = Guid.NewGuid().ToString() + ".pdf";
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Documents", "pdfs", resumeUrl);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await pdfFile.CopyToAsync(stream);
                }

                existingCandidate.ResumeUrl = resumeUrl;
            }

            // Update other fields
            if (!string.IsNullOrEmpty(dto.FirstName))
            {
                existingCandidate.FirstName = dto.FirstName;
            }

            if (!string.IsNullOrEmpty(dto.LastName))
            {
                existingCandidate.LastName = dto.LastName;
            }

            if (!string.IsNullOrEmpty(dto.Email))
            {
                existingCandidate.Email = dto.Email;
            }

            if (!string.IsNullOrEmpty(dto.Phone))
            {
                existingCandidate.Phone = dto.Phone;
            }

            if (!string.IsNullOrEmpty(dto.CoverLetter))
            {
                existingCandidate.CoverLetter = dto.CoverLetter;
            }

            if (dto.JobId > 0)
            {
                existingCandidate.JobId = dto.JobId;
            }

            await _context.SaveChangesAsync();

            return Ok("Candidate updated successfully");
        }



        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<IEnumerable<CandidateGetDto>>> GetCandidates()
        {
            var candidates = await _context.Candidates.Include(c => c.Job).ToListAsync();
            var convertedCandidates = _mapper.Map<IEnumerable<CandidateGetDto>>(candidates);

            return Ok(convertedCandidates);
        }

        // download pdf file
        [HttpGet]
        [Route("download/{url}")]
        public IActionResult DownloadPdfFile(string url)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Documents", "pdfs", url);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File Not Found!");
            }

            var pdfByte = System.IO.File.ReadAllBytes(filePath);
            var file = File(pdfByte, "application/pdf", url);
            return file;
        }

        // delete candidate
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteCandidate(long id)
        {
            var existingCandidate = await _context.Candidates.FindAsync(id);

            if (existingCandidate == null)
            {
                return NotFound("Candidate not found");
            }   
            _context.Candidates.Remove(existingCandidate);
            await _context.SaveChangesAsync();

            return Ok("Candidate Deleted Successfully");
        }
    }
}
