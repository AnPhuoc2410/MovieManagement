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
        [Route("all")]
        public async Task<IActionResult> GetAllPromotionsAsync()
        {
            var promotions = await _promotionService.GetAllPromotionsAsync();
            return Ok(promotions);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<IActionResult> GetPagePromotionAsync(int page, int pageSize)
        {
            var promotions = await _promotionService.GetPromotionPageAsync(page, pageSize);
            return Ok(promotions);
        }


        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PromotionDto>> GetPromotionByIdAsync(Guid id)
        {
            var promotion = await _promotionService.GetPromotionByIdAsync(id);
            if (promotion == null)
            {
                return NotFound();
            }
            return promotion;
        }


        [HttpPost]
        public async Task<ActionResult<PromotionDto>> CreatePromotionAsync([FromBody] PromotionDto promotionDto)
        {
            var @new = await _promotionService.CreatePromotionAsync(promotionDto);
            return @new;
        }


        [HttpPut("{id:guid}")]
        public async Task<ActionResult<PromotionDto>> UpdatePromotionAsync(Guid id, [FromBody] PromotionDto promotionDto)
        {
            try
            {
                var updatedPromotion = await _promotionService.UpdatePromotionAsync(id, promotionDto);
                return Ok(updatedPromotion);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }


        [HttpDelete("{id:guid}")]
        public async Task<bool> DeletePromotionAsync(Guid id)
        {
            var result = await _promotionService.DeletePromotionAsync(id);
            return result;
        }

    }
}
