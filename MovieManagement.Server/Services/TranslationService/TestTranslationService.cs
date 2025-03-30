using Microsoft.Extensions.Localization;
using MovieManagement.Server.Models;
using MovieManagement.Server.Resources;

namespace MovieManagement.Server.Services.TranslationService
{
    public class TestTranslationService : ITestTranslationService
    {
        private readonly IStringLocalizer _localizer;

        public TestTranslationService(IStringLocalizerFactory factory)
        {
            var type = typeof(SharedResource);
            _localizer = factory.Create("Resource", type.Assembly.FullName);
        }
        public List<TestModel> GetTestModels()
        {
            return new List<TestModel>
            {
                new TestModel
                {
                    Id = "1",
                    Name = _localizer["ProductName"],
                    Description = _localizer["Description"]
                }
            };
        }
    }
}
