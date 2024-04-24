import http from 'k6/http';
import { sleep, group } from 'k6';

const BASE_URL = `http://10.1.4.32:8080/tools.descartes.teastore.webui/`;

export const options = {
  discardResponseBodies: true,
  scenarios: {
    rampUsers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '30s', target: 50 },
        { duration: '60s', target: 100},
      ],
      gracefulRampDown: '30s',
    },
  },
};

export default function () {
    group('Rooibos Category Browse', () => {
        http.get(`${BASE_URL}/category?category=5&page=5`);
        sleep(0.5)
    });

    group('add items to cart', () => {
      const body = {
        productid : 12,
        orderitem_12 : 1,
        updateCartQuantities: 'Update Cart'
      }
      http.post(`${BASE_URL}cartAction/`, body)
      sleep(0.5)
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
      sleep(0.5);
  })
}