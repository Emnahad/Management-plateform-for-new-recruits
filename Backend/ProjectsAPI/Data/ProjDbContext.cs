using Microsoft.EntityFrameworkCore;
using ProjectsAPI.Model;

namespace ProjectsAPI.Data
{
    public class ProjDbContext : DbContext
    {
        public ProjDbContext(DbContextOptions<ProjDbContext> options) : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Project>().ToTable("projects");
            builder.Entity<User>().ToTable("users");
            builder.Entity<Employee>().ToTable("employees");
            builder.Entity<ContactMessage>().ToTable("contactmessages");
            builder.Entity<ContactMessage>().Property(c => c.Email).IsRequired();
        }
    }
}
