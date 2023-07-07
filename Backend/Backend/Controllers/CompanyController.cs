using AutoMapper;
using Backend.Core.Context;
using Backend.Core.Dtos.Company;
using Backend.Core.Entities;
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
        public async Task<IActionResult> UpdateCompany(long id, [FromBody] CompanyCreateDto dto)
        {
            var existingCompany = await _context.Companies.FindAsync(id);

            if (existingCompany == null)
            {
                return NotFound("Company not found");
            }

            existingCompany.Name = dto.Name;
            existingCompany.Size = dto.Size;
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
            _context.Companies.Remove(existingCompanies);
            await _context.SaveChangesAsync();

            return Ok("Company Deleted Successfully");
        }


    }
}
