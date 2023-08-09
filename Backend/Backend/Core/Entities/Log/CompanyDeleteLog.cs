using System.ComponentModel.DataAnnotations;

namespace Backend.Core.Entities.Log
{
    public class CompanyDeleteLog
    {
        [Key]
        public long Id { get; set; }
        public long CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string CompanySize { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime DeletedTime { get; set; }
    }
}