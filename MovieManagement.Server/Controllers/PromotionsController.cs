using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        [Route("GetAll")]
        [ProducesResponseType(typeof(ApiResponseServices<TicketTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAllPromotions()
        {
            try
            {
                var promotions = await _promotionService.GetAllAsync();
                var response = new ApiResponseServices<IEnumerable<PromotionDto>>
                {
                    StatusCode = 200,
                    Message = "Promotions retrieved successfully",
                    IsSuccess = true,
                    Data = promotions
                };
                return Ok(response);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<IEnumerable<PromotionDto>>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (NotFoundException ex)
            {
                var response = new ApiResponseServices<IEnumerable<PromotionDto>>
                {
                    StatusCode = 404,
                    Message = "Promotions not found",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return NotFound(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving promotions",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponseServices<TicketTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            try
            {
                var promotions = await _promotionService.GetPageAsync(page, pageSize);
                var response = new ApiResponseServices<IEnumerable<PromotionDto>>
                {
                    StatusCode = 200,
                    Message = "Promotions retrieved successfully",
                    IsSuccess = true,
                    Data = promotions
                };
                return Ok(response);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<IEnumerable<PromotionDto>>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (NotFoundException ex)
            {
                var response = new ApiResponseServices<IEnumerable<PromotionDto>>
                {
                    StatusCode = 404,
                    Message = "Promotions not found",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return NotFound(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving promotions",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpGet("GetById/{id:guid}")]
        [ProducesResponseType(typeof(ApiResponseServices<TicketTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PromotionDto>> GetPromotion(Guid id)
        {
            try
            {
                var promotion = await _promotionService.GetByIdAsync(id);
                if (promotion == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Promotion not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok(promotion);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving promotion",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpPost]
        [Route("CreateAsync")]
        [ProducesResponseType(typeof(ApiResponseServices<TicketTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PromotionDto>> CreatePromotion([FromBody] PromotionDto promotionDto)
        {
            try
            {
                var @new = await _promotionService.CreateAsync(promotionDto);
                var response = new ApiResponseServices<PromotionDto>
                {
                    StatusCode = 200,
                    Message = "Promotion created successfully",
                    IsSuccess = true,
                    Data = @new
                };
                return Ok(response);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (NotFoundException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 404,
                    Message = "Promotion not found",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return NotFound(response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while creating promotion",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpPut("Update/{id:guid}")]
        [ProducesResponseType(typeof(ApiResponseServices<TicketTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdatePromotion(Guid id, [FromBody] PromotionDto promotionDto)
        {
            try
            {
                var updatedPromotion = await _promotionService.UpdateAsync(id, promotionDto);
                if (updatedPromotion == null)
                {
                    var responses = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Promotion not found",
                        IsSuccess = false
                    };
                    return NotFound(responses);
                }
                var response = new ApiResponseServices<PromotionDto>
                {
                    StatusCode = 200,
                    Message = "Promotion updated successfully",
                    IsSuccess = true,
                    Data = updatedPromotion
                };
                return Ok(response);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating promotion",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpDelete("Delete/{id:guid}")]
        [ProducesResponseType(typeof(ApiResponseServices<TicketTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeletePromotion(Guid id)
        {
            try
            {
                var result = await _promotionService.DeleteAsync(id);
                if (!result)
                {
                    var responses = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Promotion not found",
                        IsSuccess = false
                    };
                    return NotFound(responses);
                }
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 200,
                    Message = "Promotion deleted successfully",
                    IsSuccess = true
                };
                return NoContent();
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while deleting promotion",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

    }
}
