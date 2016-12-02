using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

using LoomBandGallery.Data.Comments;
using LoomBandGallery.Data.Items;
using LoomBandGallery.Data.Users;

namespace LoomBandGallery.Data
{
    public class DbSeeder
    {
        #region Private Members
        private ApplicationDbContext DbContext;
        #endregion Private Members

        #region Constructor
        public DbSeeder(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
        }
        #endregion Constructor

        #region Public Methods
        public async Task SeedAsync()
        {
            // Create the Db if it doesn't exist
            DbContext.Database.EnsureCreated();
            // Create default Users
            if (await DbContext.Users.CountAsync() == 0) CreateUsers();
            // Create default Items (if there are none) and Comments
            if (await DbContext.Items.CountAsync() == 0) CreateItems();
        }
        #endregion Public Methods

        #region Seed Methods
        private void CreateUsers()
        {
            DateTime createdDate = DateTime.Now;
            DateTime lastModifiedDate = DateTime.Now;

            // Create the "Admin" ApplicationUser account (if it doesn't exist already)
            var user_Admin = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Admin",
                Email = "snestertsev@yandex.ru",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };
            // Create some sample registered user account(s) (if they don't exist already)
            var user_Rimma = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Rimma",
                Email = "rnestertseva@yandex.ru",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };
            // Insert sample registered users into the Database
            DbContext.Users.AddRange(user_Admin, user_Rimma);
            DbContext.SaveChanges();
        }

        private void CreateItems()
        {
            DateTime createdDate = new DateTime(2016, 03, 01, 12, 30, 00);
            DateTime lastModifiedDate = DateTime.Now;
            string authorId = DbContext.Users.Where(u => u.UserName == "Admin").FirstOrDefault().Id;

#if DEBUG
            var num = 1000; // create 1000 sample items
            for (int id = 1; id <= num; id++)
            {
                DbContext.Items.Add(GetSampleItem(id, authorId, num - id, new DateTime(2015, 12, 31).AddDays(-num)));
            }

            EntityEntry<Item> e1 = DbContext.Items.Add(new Item()
            {
                UserId = authorId,
                Title = "Magarena",
                Description = "Single-player fantasy card game similar to Magic: The Gathering",
                Text = @"Loosely based on Magic: The Gathering, the game lets you play against a computer opponent or another human being. 
                The game features a well-developed AI, an intuitive and clear interface and an enticing level of gameplay.",
                Notes = "This is a sample record created by the Code-First Configuration class",
                ViewCount = 2343,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            // Create default Comments (if there are none)
            if (DbContext.Comments.Count() == 0)
            {
                int numComments = 10; // comments per item
                for (int i = 1; i <= numComments; i++)
                    DbContext.Comments.Add(GetSampleComment(i, e1.Entity.Id, authorId,
                    createdDate.AddDays(i)));
            }
#endif
            DbContext.SaveChanges();
        }
        #endregion Seed Methods

        #region Utility Methods
        /// <summary>
        /// Generate a sample item to populate the DB.
        /// </summary>
        /// <param name="userId">the author ID</param>
        /// <param name="id">the item ID</param>
        /// <param name="createdDate">the item CreatedDate</param>
        private Item GetSampleItem(int id, string authorId, int viewCount, DateTime createdDate)
        {
            return new Item()
            {
                UserId = authorId,
                Title = $"Item {id} Title",
                Description = $"This is a sample description for item {id}: Lorem ipsum dolor sit amet.",
                Notes = "This is a sample record created by the Code-First Configuration class",
                ViewCount = viewCount,
                CreatedDate = createdDate,
                LastModifiedDate = createdDate
            };
        }

        /// <summary>
        /// Generate a sample array of Comments (for testing purposes only).
        /// </summary>
        /// <param name="n">Comment number</param>
        /// <param name="item">the item ID</param>
        /// <param name="authorID">the author ID</param>
        /// <returns></returns>
        private Comment GetSampleComment(int n, int itemId, string authorId, DateTime createdDate)
        {
            return new Comment()
            {
                ItemId = itemId,
                UserId = authorId,
                ParentId = null,
                Text = $"Sample comment #{n} for the item #{itemId}",
                CreatedDate = createdDate,
                LastModifiedDate = createdDate
            };
        }
        #endregion Utility Methods
    }
}
