using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Nelibur.ObjectMapper;

using LoomBandGallery.Data;
using LoomBandGallery.Data.Items;
using LoomBandGallery.Data.Users;
using LoomBandGallery.ViewModels;

namespace LoomBandGallery.Controllers
{
    public class ItemsController : BaseController
    {
        #region Constructor
        public ItemsController(ApplicationDbContext context,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager) : base(context, signInManager, userManager)
        {
        }
        #endregion Constructor

        #region Attribute-based routes

        /// <summary>
        /// GET: api/items/GetLatest
        /// </summary>
        [HttpGet("GetLatest")]
        public IActionResult GetLatest()
        {
            return GetLatest(DefaultNumberOfItems);
        }

        /// <summary>
        /// GET: api/items/GetLatest/{num}
        /// </summary>
        [HttpGet("GetLatest/{num}")]
        public IActionResult GetLatest(int num)
        {
            if (num > MaxNumberOfItems) num = MaxNumberOfItems;
            var items = DbContext.Items.OrderByDescending(i => i.CreatedDate).Take(num).ToArray();
            return new JsonResult(ToItemViewModelList(items), DefaultJsonSettings);
        }

        /// <summary>
        /// GET: api/items/GetMostViewed
        /// </summary>
        [HttpGet("GetMostViewed")]
        public IActionResult GetMostViewed()
        {
            return GetMostViewed(DefaultNumberOfItems);
        }

        /// <summary>
        /// GET: api/items/GetMostViewed/{num}
        /// </summary>
        [HttpGet("GetMostViewed/{num}")]
        public IActionResult GetMostViewed(int num)
        {
            if (num > MaxNumberOfItems) num = MaxNumberOfItems;
            var items = DbContext.Items.OrderByDescending(i => i.ViewCount).Take(num).ToArray();
            return new JsonResult(ToItemViewModelList(items), DefaultJsonSettings);
        }

        /// <summary>
        /// GET: api/items/GetRandom
        /// </summary>
        [HttpGet("GetRandom")]
        public IActionResult GetRandom()
        {
            return GetRandom(DefaultNumberOfItems);
        }

        /// <summary>
        /// GET: api/items/GetRandom/{num}
        /// </summary>
        [HttpGet("GetRandom/{num}")]
        public IActionResult GetRandom(int num)
        {
            if (num > MaxNumberOfItems) num = MaxNumberOfItems;
            var items = DbContext.Items.OrderBy(i => Guid.NewGuid()).Take(num).ToArray();
            return new JsonResult(ToItemViewModelList(items), DefaultJsonSettings);
        }
        #endregion Attribute-based routes

        #region RESTful Conventions
        /// <summary>
        /// GET: api/items
        /// </summary>
        /// <returns>Nothing: this method will raise a HttpNotFound HTTP Exception, since  we're not supporting this API call.</returns>
        [HttpGet()]
        public IActionResult Get()
        {
            return NotFound(new { Error = "not found" });
        }

        /// <summary>
        /// GET: ap/items/{id}
        /// </summary>
        /// <returns>A Json-serialized object representing a single item.</returns>
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var item = DbContext.Items.Where(i => i.Id == id).FirstOrDefault();
            if (item != null)
            {
                return new JsonResult(TinyMapper.Map<ItemViewModel>(item), DefaultJsonSettings);
            }
            else
            {
                return NotFound(new { Error = $"Item ID {id} has not been found" });
            }
        }

        /// <summary>
        /// POST: api/items
        /// </summary>
        /// <returns>Creates a new Item and return it accordingly.</returns>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Add([FromBody]ItemViewModel ivm)
        {
            if (ivm != null)
            {
                var item = TinyMapper.Map<Item>(ivm);
                item.CreatedDate = item.LastModifiedDate = DateTime.Now;
                item.UserId = await GetCurrentUserId();

                DbContext.Items.Add(item);
                DbContext.SaveChanges();
                return new JsonResult(TinyMapper.Map<ItemViewModel>(item), DefaultJsonSettings);
            }
            return new StatusCodeResult(500);
        }

        /// <summary>
        /// PUT: api/items/{id}
        /// </summary>
        /// <returns>Updates an existing Item and return it accordingly.</returns>
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Update(int id, [FromBody] ItemViewModel ivm)
        {
            if (ivm != null)
            {
                var item = DbContext.Items.Where(i => i.Id == id).FirstOrDefault();
                if (item != null)
                {
                    // handle the update (on per-property basis)
                    item.UserId = ivm.UserId;
                    item.Description = ivm.Description;
                    item.Flags = ivm.Flags;
                    item.Notes = ivm.Notes;
                    item.Text = ivm.Text;
                    item.Title = ivm.Title;
                    item.Type = ivm.Type;
                    // override any property that could be wise to set from server-side only
                    item.LastModifiedDate = DateTime.Now;

                    DbContext.SaveChanges();
                    return new JsonResult(TinyMapper.Map<ItemViewModel>(item), DefaultJsonSettings);
                }
            }
            return NotFound(new { Error = $"Item ID {id} has not been found" });
        }

        /// <summary>
        /// DELETE: api/items/{id}
        /// </summary>
        /// <returns>Deletes an Item, returning a HTTP status 200 (ok) when done.</returns>
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(int id)
        {
            var item = DbContext.Items.Where(i => i.Id == id).FirstOrDefault();
            if (item != null)
            {
                DbContext.Items.Remove(item);
                DbContext.SaveChanges();
                return new OkResult();
            }
            return NotFound(new { Error = $"Item ID {id} has not been found" });
        }
        #endregion

        #region Private members
        /// <summary>
        /// Maps a collection of Item entities into a list of ItemViewModel objects.
        /// </summary>
        /// <param name="items">An IEnumerable collection of item entities</param>
        /// <returns>a mapped list of ItemViewModel objects</returns>
        private List<ItemViewModel> ToItemViewModelList(IEnumerable<Item> items)
        {
            var lst = new List<ItemViewModel>();
            foreach (var i in items)
            {
                lst.Add(TinyMapper.Map<ItemViewModel>(i));
            }
            return lst;
        }

        /// <summary>
        /// The default number of items to retrieve when using the parameterless overloads of the API methods retrieving item lists.
        /// </summary>
        private int DefaultNumberOfItems
        {
            get
            {
                return 5;
            }
        }

        /// <summary>
        /// The maximum number of items to retrieve when using the API methods retrieving item lists.
        /// </summary>
        private int MaxNumberOfItems
        {
            get
            {
                return 100;
            }
        }
        #endregion Private members
    }
}
