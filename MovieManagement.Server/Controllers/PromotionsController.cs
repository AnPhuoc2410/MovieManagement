using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionsController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;

        public PromotionsController(UnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        // GET: api/Promotions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Promotion>>> GetPromotions()
        {
            return await _unitOfWork.PromotionRepository.GetAllAsync();
        }

        // GET: api/Promotions/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<Promotion>> GetPromotion(Guid id)
        //{
        //    var promotion = await _context.Promotions.FindAsync(id);

        //    if (promotion == null)
        //    {
        //        return NotFound();
        //    }

        //    return promotion;
        //}

        // PUT: api/Promotions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutPromotion(Guid id, Promotion promotion)
        //{
        //    if (id != promotion.PromotionId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(promotion).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!PromotionExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        // POST: api/Promotions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Promotion>> PostPromotion(Promotion promotion)
        {
            await _unitOfWork.PromotionRepository.CreateAsync(promotion);
            return CreatedAtAction("GetPromotion", new { id = promotion.PromotionId }, promotion);
        }

        // DELETE: api/Promotions/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeletePromotion(Guid id)
        //{
        //    var promotion = await _context.Promotions.FindAsync(id);
        //    if (promotion == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Promotions.Remove(promotion);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        //private bool PromotionExists(Guid id)
        //{
        //    return _context.Promotions.Any(e => e.PromotionId == id);
        //}
    }
}
