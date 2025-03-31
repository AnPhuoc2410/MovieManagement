
using Microsoft.Extensions.Localization;

namespace MovieManagement.Server.Services.TranslationService
{
    public class TranslationService : ITranslationService
    {
        private readonly IStringLocalizer<TranslationService> _localizer;

        public TranslationService(IStringLocalizer<TranslationService> localizer)
        {
            _localizer = localizer;
        }

        public Task<string> TranslateAsync(string text, string targetLanguage)
        {
            return Task.FromResult(_localizer[text].Value);
        }
    }
}
