import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}

  async checkLogin() {
    return axios
      .get('http://127.0.0.1:8888/verify-token', { withCredentials: true })
      .then((response) => response.data.success === true)
      .catch(() => false);
  }
}
