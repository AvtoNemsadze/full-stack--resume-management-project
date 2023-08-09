using Backend.Core.Enums;

namespace Backend.Core.Dtos.Company
{
    public class CompanyUpdateDto
    {
        public string Name { get; set; }
        public CompanySize Size { get; set; }
    }
}
