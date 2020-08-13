import common_en from './common-en';
import common_nl from './common-nl';
import employee_en from './employee-en';
import employee_nl from './employee-nl';
import hours_en from './hours-en';
import hours_nl from './hours-nl';

const all = {
    en: {...common_en, ...employee_en, ...hours_en},
    nl: {...common_nl, ...employee_nl, ...hours_nl}
}

export default all;