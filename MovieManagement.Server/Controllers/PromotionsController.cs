using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services.PromotionService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionsController : ControllerBase
    {
        private readonly IPromotionService _promotionService;

        public PromotionsController(IPromotionService promotionService)
        {
            _promotionService = promotionService;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult> GetAllPromotions()
        {
            var promotions = await _promotionService.GetAllAsync();
            return Ok(promotions);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            var promotions = await _promotionService.GetPageAsync(page, pageSize);
            return Ok(promotions);
        }


        [HttpGet("GetById/{id:guid}")]
        public async Task<ActionResult<PromotionDto>> GetPromotion(Guid id)
        {
            var promotion = await _promotionService.GetByIdAsync(id);
            if (promotion == null)
            {
                return NotFound();
            }
            return promotion;
        }


        [HttpPost]
        [Route("CreateAsync")]
        public async Task<ActionResult<PromotionDto>> CreatePromotion([FromBody] PromotionDto promotionDto)
        {
            var @new = await _promotionService.CreateAsync(promotionDto);
            return @new;
        }


        [HttpPut("Update/{id:guid}")]
        public async Task<IActionResult> UpdatePromotion(Guid id, [FromBody] PromotionDto promotionDto)
        {
            try
            {
                var updatedPromotion = await _promotionService.UpdateAsync(id, promotionDto);
                return Ok(updatedPromotion);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }


        [HttpDelete("Delete/{id:guid}")]
        public async Task<IActionResult> DeletePromotion(Guid id)
        {
            var result = await _promotionService.DeleteAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

    }
}
