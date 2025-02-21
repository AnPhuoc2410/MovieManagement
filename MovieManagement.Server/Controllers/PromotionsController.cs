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
        private readonly IMapper _mapper;

        public PromotionsController(IPromotionService promotionService, IMapper mapper)
        {
            _promotionService = promotionService;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("GetAllPromotions")]
        public async Task<ActionResult> GetAllPromotions()
        {
            var promotions = _mapper.Map<List<PromotionDto>>(await _promotionService.GetAllPromotions());
            return Ok(promotions);
        }

        [HttpPost]
        [Route("CreatePromotion")]
        public async Task<ActionResult<Promotion>> CreatePromotion(PromotionDto promotionDto)
        {
            Promotion promotion = _mapper.Map<Promotion>(promotionDto);
            var createdPromotion = _mapper.Map<PromotionDto>(await _promotionService.CreatePromotion(promotion));
            return CreatedAtAction(nameof(GetPromotion), new { id = createdPromotion.PromotionId }, createdPromotion);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PromotionDto>> GetPromotion(Guid id)
        {
            var promotion = await _promotionService.GetPromotion(id);
            if (promotion == null)
            {
                return NotFound();
            }
            return _mapper.Map<PromotionDto>(promotion);
        }


        [HttpPut("UpdatePromotion/{id:guid}")]
        public async Task<IActionResult> UpdatePromotion(Guid id, PromotionDto promotionDto)
        {
            try
            {
                var updatedPromotion = _mapper.Map<PromotionDto>(await _promotionService.UpdatePromotion(id, _mapper.Map<Promotion>(promotionDto)));
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
