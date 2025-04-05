export const getLanguageHeader = (lang: string): string => {
  switch (lang) {
    case 'en':
      return 'en-US,en;q=0.9';
    case 'jp':
      return 'ja-JP,ja;q=0.9';
    case 'vi':
    default:
      return 'vi-VN,vi;q=0.9';
  }
};
