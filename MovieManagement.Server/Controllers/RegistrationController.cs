﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {

        private readonly UnitOfWork _unitOfWork;

        public RegistrationController(UnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        
        [HttpPost]
        [Route("Registration")]
        public async Task<IActionResult> Create(NhanVienDto Employee)
        {
            try
            {
                _unitOfWork.EmployeeRepository.Create(new Employee
                {
                    AccountName = Employee.AccountName,
                    Address = Employee.Address,
                    Avatar = Employee.Avatar,
                    BirthDate = Employee.BirthDate,
                    JoinDate = DateTime.Now,
                    Email = Employee.Email,
                    FullName = Employee.FullName,
                    Gender = Employee.Gender,
                    IDCard = Employee.IDCard,
                    Level = Employee.Level,
                    Password = Employee.Password,
                    PhoneNumber = Employee.PhoneNumber,
                    Status = Employee.Status
                });
                return Ok("Created successfully!");
            }
            catch (Exception err)
            {
                return BadRequest(err.Message);
            }
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var list = _unitOfWork.EmployeeRepository.GetAll();
                return Ok(list);
            }
            catch (Exception err)
            {
                return BadRequest(err.Message);
            }
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string Employee)
        {
            try
            {
                var list = _unitOfWork.EmployeeRepository.Delete(Employee);
                return Ok(list);
            }
            catch (Exception err)
            {
                return BadRequest(err.Message);
            }
        }





    }
}
