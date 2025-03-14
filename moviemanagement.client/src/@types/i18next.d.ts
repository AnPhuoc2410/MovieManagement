import "i18next";
import { defaultNS, resources } from "src/i18n/i18n";

declare module "i18next" {
  // Kế thừa (thêm vào type)
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      vi: typeof resources.vi;
      en: typeof resources.en;
      jp: typeof resources.jp;
    };
  }
}
