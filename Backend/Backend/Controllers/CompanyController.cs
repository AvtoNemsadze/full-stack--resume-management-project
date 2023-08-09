using AutoMapper;
using Backend.Core.Context;
using Backend.Core.Dtos.Company;
using Backend.Core.Entities;
using Backend.Core.Entities.Log;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private ApplicationDbContext _context { get; }
        public IMapper _mapper { get; set; } 

        public CompanyController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateCompany([FromBody] CompanyCreateDto dto)
        {
            Company newCompany = _mapper.Map<Company>(dto);
            await _context.Companies.AddAsync(newCompany);
            await _context.SaveChangesAsync();

            return Ok("Company created successfully");
        }

        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<IEnumerable<CompanyGetDto>>> GetCompanies()
        {
            var companies = await _context.Companies.OrderByDescending(q => q.CreatedAt).ToListAsync();
            var convertedComapnies = _mapper.Map <IEnumerable<CompanyGetDto>>(companies);

            return Ok(convertedComapnies);
        }

        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateCompany(long id, [FromBody] CompanyUpdateDto dto)
        {
            var existingCompany = await _context.Companies.FindAsync(id);

            if (existingCompany == null)
            {
                return NotFound("Company not found");
            }

            CompanyUpdateLog updateLog = new()
            {
                CompanyId = existingCompany.ID,
                CompanyName = existingCompany.Name,
                UpdatedName = dto.Name,
                CompanySize = existingCompany.Size.ToString(),
                UpdatedSize = dto.Size.ToString(),
                Message = $"company with name '{existingCompany.Name}' updated",
                UpdatedTime = DateTime.Now
            };

            existingCompany.Name = dto.Name;
            existingCompany.Size = dto.Size;

            _context.CompanyUpdateLogs.Add(updateLog);

            await _context.SaveChangesAsync();

            return Ok("Company updated successfully");
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteCompany(long id)
        {
            var existingCompanies = await _context.Companies.FindAsync(id);

            if (existingCompanies == null)
            {
                return NotFound("Companies not found");
            }

            CompanyDeleteLog deleteLog = new()
            {
                CompanyId = existingCompanies.ID,
                CompanyName = existingCompanies.Name,
                CompanySize = existingCompanies.Size.ToString(),
                Message = $"company with name {existingCompanies.Name} deleted from table",
                DeletedTime = DateTime.Now
            };

            _context.CompanyDeleteLogs.Add(deleteLog);
            _context.Companies.Remove(existingCompanies);

            await _context.SaveChangesAsync();

            return Ok("Company Deleted Successfully");
        }

    }
}
