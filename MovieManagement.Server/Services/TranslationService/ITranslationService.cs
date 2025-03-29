namespace MovieManagement.Server.Services.TranslationService
{
    public interface ITranslationService
    {
        public Task<string> TranslateAsync(string text, string targetLanguage);
    }
}
