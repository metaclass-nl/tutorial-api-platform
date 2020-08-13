import {createIntl, createIntlCache} from 'react-intl';

function getMessages(locale, messages) {
    if (messages[locale]!==undefined) {
        return messages[locale];
    }
    return messages[locale.substr(0,2)];
}

const cache = createIntlCache()

let intl = null;

export function initIntl(locale, messages) {
    intl = createIntl({
        locale: locale,
        messages: getMessages(locale, messages)
    }, cache);
}

export default function getIntl() {
    return intl;
}