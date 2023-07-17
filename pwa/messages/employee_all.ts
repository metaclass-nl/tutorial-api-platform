import common_en from "./common-en";
import common_nl from "./common-nl";
import employee_en from "./employee-en";
import employee_nl from "./employee-nl";

const all = {
    en: {...common_en, ...employee_en},
    nl: {...common_nl, ...employee_nl},
}

export default all;
