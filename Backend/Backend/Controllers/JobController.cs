using AutoMapper;
using Backend.Core.Context;
using Backend.Core.Dtos.Company;
using Backend.Core.Dtos.Job;
using Backend.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> UpdateJob(long id, [FromBody] JobCreateDto dto)
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
            var existingJob = await _context.Jobs.FindAsync(id);

            if (existingJob == null)
            {
                return NotFound("Job not found");
            }
            _context.Jobs.Remove(existingJob);
            await _context.SaveChangesAsync();

            return Ok("Job Deleted Successfully");
        }
    }
}
