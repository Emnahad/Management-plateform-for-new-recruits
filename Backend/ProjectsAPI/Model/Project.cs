using System;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProjectsAPI.Model
{
    public class Project
    {
        public Guid? Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string full_Description { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string VideoUrl { get; set; }
        public string Image { get; set; }
        public string DocumentFileName { get; set; }

    }
}
