import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  verifyToken(): Promise<AxiosResponse> {
    return axios.get('http://127.0.0.1:8888/verify-token', {
      withCredentials: true,
    });
  }

  getProfile(): Promise<AxiosResponse> {
    return axios.get('http://127.0.0.1:8888/profile', {
      withCredentials: true,
    });
  }

  getPlaylists(): Promise<AxiosResponse> {
    return axios.get('http://127.0.0.1:8888/playlists', {
      withCredentials: true,
    });
  }

  getSongs(): Promise<AxiosResponse> {
    return axios.get('http://localhost:3000/songs');
  }
}
