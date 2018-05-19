import axios from 'axios'

const baseURL = [80, 443].includes(parseInt(process.env.PORT, 10)) ? '/' : `${process.env.DOMAIN}:${process.env.PORT}`;
console.log('Base URl', baseURL);
console.log('process', process);

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

export default ({ Vue }) => {
  Vue.prototype.$axios = instance
}
