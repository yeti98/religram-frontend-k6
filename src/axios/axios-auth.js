import axios from 'axios';

const auth = axios.create({
    baseURL: process.env.VUE_APP_BASE_API+ "/api/v1/auth",
    timeout: 5000
});


export default auth