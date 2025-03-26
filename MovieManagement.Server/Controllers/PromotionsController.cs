using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services;
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

        [HttpGet("all")]
        [ProducesResponseType(typeof(ApiResponse<PromotionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllPromotionsAsync()
        {
            var promotions = await _promotionService.GetAllPromotionsAsync();
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get all promotions is success",
                IsSuccess = true,
                Data = promotions
            };
            return Ok(response);
        }

        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<PromotionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPagePromotionAsync(int page, int pageSize)
        {
            var promotions = await _promotionService.GetPromotionPageAsync(page, pageSize);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get promotions is success",
                IsSuccess = true,
                Data = promotions
            };
            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(ApiResponse<PromotionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PromotionDto>> GetPromotionByIdAsync(Guid id)
        {
            var promotion = await _promotionService.GetPromotionByIdAsync(id);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get promotion is success",
                IsSuccess = true,
                Data = promotion
            };
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<PromotionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PromotionDto>> CreatePromotionAsync([FromBody] PromotionDto promotionDto)
        {
            var newPromotion = await _promotionService.CreatePromotionAsync(promotionDto);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Create promotion is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(ApiResponse<PromotionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PromotionDto>> UpdatePromotionAsync(Guid id, [FromBody] PromotionDto promotionDto)
        {
            var updatedPromotion = await _promotionService.UpdatePromotionAsync(id, promotionDto);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Update promotion is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(typeof(ApiResponse<PromotionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeletePromotionAsync(Guid id)
        {
            var isDeleted = await _promotionService.DeletePromotionAsync(id);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Delete promotion is success",
                IsSuccess = true,
            };
            return Ok(response);
        }
    }
}