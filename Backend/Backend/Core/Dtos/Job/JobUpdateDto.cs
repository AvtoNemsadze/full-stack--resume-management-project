using Backend.Core.Enums;

namespace Backend.Core.Dtos.Job
{
    public class JobUpdateDto
    {
        public string Title { get; set; } = null!;
        public JobLevel Level { get; set; }
        public long CompanyId { get; set; }
    }
}
