using MovieManagement.Server.Models.Entities;
using NuGet.ContentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MMTest.MemberTest
{
    class MemberEntityUnitTest
    {

        private User _user;
        private Bill _bill;

        [SetUp]
        public void Setup()
        {
            _user = new User();
            _bill = new Bill();
        }


        [Test]
        public void Should_Member_Created_Correctly()
        {
            _user.UserId = Guid.NewGuid();
            _user.UserName = "test";
            _user.Password = "test";
            _user.Avatar = "test";
            _user.JoinDate = DateTime.Now;
            _user.FullName = "test";
            _user.BirthDate = DateTime.Now;
            _user.Gender = 0;
            _user.IDCard = "test";
            _user.Email = "test";
            _user.PhoneNumber = "test";
            _user.Address = "test";
            _user.Point = 0;
            _user.Status = 0;
            _user.Bills = new List<Bill>();

            Assert.That(_user.Password, Is.EqualTo("test"));
            Assert.That(_user.UserName, Is.EqualTo("test"));
        }
    }
}
