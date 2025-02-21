﻿using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.BillService
{
    public class BillService : IBillService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;


        public BillService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }


        public async Task<IEnumerable<BillDto>> GetAllBillsAsync()
        {
            var bills = await _unitOfWork.BillRepository.GetAllAsync();
            return _mapper.Map<List<BillDto>>(bills);
        }


        public async Task<BillDto> GetBillByIdAsync(Guid billId)
        {
            var bill = await _unitOfWork.BillRepository.GetByIdAsync(billId);
            return _mapper.Map<BillDto>(bill);
        }



        public async Task<BillDto> CreateBillAsync(Guid movieId, Guid memberId, Guid employeeId, Guid promotionId, BillDto billDto)
        {
            var newBill = new Bill
            {
                CreatedDate = billDto.CreatedDate,
                Point = billDto.Point,
                TotalTicket = billDto.TotalTicket,
                Amount = billDto.Amount,
                MovieId = movieId,
                Showtime = billDto.Showtime,
                MemberId = memberId,
                EmployeeId = employeeId,
                PromotionId = promotionId,
                Status = billDto.Status,
            };
            var bill = await _unitOfWork.BillRepository.CreateAsync(newBill);
            return _mapper.Map<BillDto>(bill);
        }



        public async Task<BillDto> UpdateBillAsync(Guid billId, BillDto billDto)
        {
            var updateBill = await _unitOfWork.BillRepository.GetByIdAsync(billId);

            updateBill.CreatedDate = billDto.CreatedDate;
            updateBill.Point = billDto.Point;
            updateBill.TotalTicket = billDto.TotalTicket;
            updateBill.Amount = billDto.Amount;
            updateBill.MovieId = billDto.MovieId;
            updateBill.Showtime = billDto.Showtime;
            updateBill.MemberId = billDto.MemberId;
            updateBill.EmployeeId = billDto.EmployeeId;
            updateBill.PromotionId = billDto.PromotionId;
            updateBill.Status = billDto.Status;

            var bill = await _unitOfWork.BillRepository.UpdateAsync(updateBill);
            return _mapper.Map<BillDto>(bill);
        }


        public async Task<bool> DeleteBillAsync(Guid billId)
        {
            return await _unitOfWork.BillRepository.DeleteAsync(billId);
        }
    }
}
