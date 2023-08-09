using AutoMapper;
using Backend.Core.Context;
using Backend.Core.Dtos.Job;
using Backend.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Core.Entities.Log;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private ApplicationDbContext _context { get; }
        public IMapper _mapper { get; set; }

        public JobController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<IEnumerable<JobGetDto>>> GetJobs()
        {
            var jobs = await _context.Jobs.Include(job => job.Company).OrderByDescending(q => q.CreatedAt).ToListAsync();
            var convertedJobs = _mapper.Map<IEnumerable<JobGetDto>>(jobs);

            return Ok(convertedJobs);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateJob([FromBody] JobCreateDto dto)
        {
            var newJob = _mapper.Map<Job>(dto);    
            await _context.Jobs.AddAsync(newJob);
            await _context.SaveChangesAsync();

            return Ok("Job Created Successfullt");
        }

        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateJob(long id, [FromBody] JobUpdateDto dto)
        {
            var existingJob = await _context.Jobs.FindAsync(id);

            if (existingJob == null)
            {
                return NotFound("Job not found");
            }

            existingJob.Title = dto.Title;
            existingJob.Level = dto.Level;
            existingJob.CompanyId = dto.CompanyId;
            await _context.SaveChangesAsync();

            return Ok("Job updated successfully");
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteJob(long id)
        {
            var existingJob = await _context.Jobs.Include(j => j.Company).FirstOrDefaultAsync(j => j.ID == id);

            if (existingJob == null)
            {
                return NotFound("Job not found");
            }

            JobDeleteLog jobDeleteLog = new()
            {
               JobId = existingJob.ID,
               CompanyId = existingJob.CompanyId,
               JobTitle = existingJob.Title,
               JobLevel = existingJob.Level.ToString(),
               Message = $"Job with title {existingJob.Title} deleted from table",
               CompanyName = existingJob.Company.Name,
               DeletedTime = DateTime.Now
            };

            _context.JobDeleteLogs.Add(jobDeleteLog);
            _context.Jobs.Remove(existingJob);
            await _context.SaveChangesAsync();

            return Ok("Job Deleted Successfully");
        }
    }
}
