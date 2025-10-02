import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  verifyToken() {
    return axios.get('http://127.0.0.1:8888/verify-token', {
      withCredentials: true,
    });
  }

  getProfile() {
    return axios.get('http://127.0.0.1:8888/profile', {
      withCredentials: true,
    });
  }

  getPlaylists() {
    return axios.get('http://127.0.0.1:8888/playlists', {
      withCredentials: true,
    });
  }
}
