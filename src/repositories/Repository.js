import axios from "axios";

const baseDomain = process.env.VUE_APP_BASE_API + "/api/v1";
const baseURL = `${baseDomain}`;

export default axios.create({
    baseURL
});
