import enJson from "../locale/en.json";
import faJson from "../locale/fa.json";
import { useCalendarStore } from "../store/calendarStore";
import type { DotNestedKeys } from "../types/globalTypes";
import { findObjectValue } from "../utils/findObjectValue";

export const dictionaries = {
  en: enJson,
  fa: faJson,
};

export const useTranslations = () => {
  const locale = useCalendarStore((state) => state.locale);
  const dictionary = dictionaries[locale];

  const t = (translate: DotNestedKeys<typeof dictionary>): string => {
    return String(findObjectValue(dictionary, translate) || "");
  };
  return { t, lang: locale };
};
