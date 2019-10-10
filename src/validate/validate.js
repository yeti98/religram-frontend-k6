import {maxLength, minLength, required, email} from "vuelidate/lib/validators";

export const username = {
    required,
    minLength: minLength(6),
    maxLength: maxLength(32)
};
export const password = {
    required,
    minLength: minLength(6),
    maxLength: maxLength(32)
};

export const useremail = {
    required,
    email
};
