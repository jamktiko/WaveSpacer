import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  verifyToken(): Promise<AxiosResponse> {
    return axios.get(`${environment.apiUrl}verify-token`, {
      withCredentials: true,
    });
  }

  getProfile(): Promise<AxiosResponse> {
    return axios.get(`${environment.apiUrl}profile`, {
      withCredentials: true,
    });
  }

  getPlaylists(): Promise<AxiosResponse> {
    return axios.get(`${environment.apiUrl}playlists`, {
      withCredentials: true,
    });
  }
}
