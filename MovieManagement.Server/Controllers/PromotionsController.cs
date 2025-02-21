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
        [Route("GetAllPromotions")]
        public async Task<ActionResult> GetAllPromotions()
        {
            var promotions = await _promotionService.GetAllPromotions();
            return Ok(promotions);
        }


        [HttpPost]
        [Route("CreatePromotion")]
        public async Task<ActionResult<PromotionDto>> CreatePromotion([FromBody] PromotionDto promotionDto)
        {
            var @new = await _promotionService.CreatePromotion(promotionDto);
            return @new;
        }


        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PromotionDto>> GetPromotion(Guid id)
        {
            var promotion = await _promotionService.GetPromotion(id);
            if (promotion == null)
            {
                return NotFound();
            }
            return promotion;
        }


        [HttpPut("UpdatePromotion/{id:guid}")]
        public async Task<IActionResult> UpdatePromotion(Guid id, [FromBody] PromotionDto promotionDto)
        {
            try
            {
                var updatedPromotion = _promotionService.UpdatePromotion(id, promotionDto);
                return Ok(updatedPromotion);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }


        [HttpDelete("DeletePromotion/{id:guid}")]
        public async Task<IActionResult> DeletePromotion(Guid id)
        {
            var result = await _promotionService.DeletePromotion(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

    }
}
