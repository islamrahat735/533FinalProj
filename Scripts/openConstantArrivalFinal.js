import http from 'k6/http';
import { sleep, group } from 'k6';

const BASE_URL = `http://10.1.4.32:8080/tools.descartes.teastore.webui/`;

export const options = {
  discardResponseBodies: true,
  scenarios: {
    constantLoad: {
      executor: 'constant-arrival-rate',

      // 200 iterations per 1s
      rate: 500,
      timeUnit: '1s',

      preAllocatedVUs: 100,

      duration: '1m'

    },
  },
};

export default function () {
    group('Rooibos Category Browse', () => {
        http.get(`${BASE_URL}/category?category=5&page=5`);
    });

    group('add items to cart', () => {
      const body = {
        productid : 12,
        orderitem_12 : 1,
        updateCartQuantities: 'Update Cart'
      }
      http.post(`${BASE_URL}cartAction/`, body)
    } );

    group('login workflow', () => {
      http.get(`${BASE_URL}login/`);
      let body = {
        referer : BASE_URL,
        username : 'user2',
        password : 'password',
        signin: 'Sign in'
      }
      http.post(`${BASE_URL}loginAction/`, body);
      sleep(0.2)
      http.get(`${BASE_URL}profile/`);

      body = {
        logout : ''
      }
      http.post(`${BASE_URL}loginAction/`, body);
  })
}