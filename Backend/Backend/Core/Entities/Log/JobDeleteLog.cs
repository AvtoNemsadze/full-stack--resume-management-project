using System.ComponentModel.DataAnnotations;

namespace Backend.Core.Entities.Log
{
    public class JobDeleteLog
    {
        [Key]
        public long Id { get; set; }
        public long JobId { get; set; }
        public long CompanyId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string JobLevel { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime DeletedTime { get; set; }
    }
}
