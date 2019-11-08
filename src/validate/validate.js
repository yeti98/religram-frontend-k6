import {maxLength, minLength, required, sameAs, email as amail} from "vuelidate/lib/validators";


export const username = {
    required,
    minLength: minLength(6),
    maxLength: maxLength(32),
};
export const password = {
    required,
    minLength: minLength(6),
    maxLength: maxLength(32)
};

export const email = {
    minLength: minLength(1),
    amail
};
export const fullname = {
    required,
    minLength: minLength(4),
    maxLength: maxLength(32)
};
export const confirmPassword = {
    required,
    sameAsPassword: sameAs("password")
};