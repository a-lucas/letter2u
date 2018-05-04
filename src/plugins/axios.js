import axios from 'axios'

const instance = axios.create({
  baseURL: `${process.env.DOMAIN}:${process.env.PORT}`,
  timeout: 1000,
});

export default ({ Vue }) => {
  Vue.prototype.$axios = instance
}
