import { createIntl, createIntlCache } from "react-intl";

interface ReadonlyDictionary {
  readonly [index: string]: string;
}
interface Messages {
  readonly [index: string]: ReadonlyDictionary;
}

function getMessages(locale: string, messages: Messages) {
  if (messages[locale] !== undefined) {
    return messages[locale];
  }
  return messages[locale.substr(0, 2)];
}

const cache = createIntlCache();

export default function initIntl(
  locale: string | undefined,
  messages: Messages
) {
  return createIntl(
    {
      locale: locale ?? "en",
      messages: getMessages(locale ?? "en", messages),
    },
    cache
  );
}
/*
export function getLanguage(req?: { headers: string }, def = "en"): string {
  if (req === undefined) return def;

  const reqLang = req.headers["accept-language"];
  if (reqLang === undefined) {
    return def;
  }
  const piecesBySemicolon = reqLang.split(";");
  if (piecesBySemicolon[0] === undefined) return def;

  const piecesByComma = piecesBySemicolon[0].split(",");
  if (piecesByComma[0] === undefined) return def;

  return piecesByComma[0];
}
*/
