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

        private Member _member;
        private Bill _bill;

        [SetUp]
        public void Setup()
        {
            _member = new Member();
            _bill = new Bill();
        }


        [Test]
        public void Should_Member_Created_Correctly()
        {
            _member.MemberId = Guid.NewGuid();
            _member.AccountName = "test";
            _member.Password = "test";
            _member.Avatar = "test";
            _member.JoinDate = DateTime.Now;
            _member.FullName = "test";
            _member.BirthDate = DateTime.Now;
            _member.Gender = 0;
            _member.IDCard = "test";
            _member.Email = "test";
            _member.PhoneNumber = "test";
            _member.Address = "test";
            _member.Point = 0;
            _member.Status = 0;
            _member.Bills = new List<Bill>();

            Assert.That(_member.Password, Is.EqualTo("test"));
            Assert.That(_member.AccountName, Is.EqualTo("test"));
        }
    }
}
