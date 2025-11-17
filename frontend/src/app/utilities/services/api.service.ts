import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  verifyToken(): Promise<AxiosResponse> {
    return axios.get(`${environment.apiUrl}api/verify-token`, {
      withCredentials: true,
    });
  }

  getProfile(): Promise<AxiosResponse> {
    return axios.get(`${environment.apiUrl}api/profile`, {
      withCredentials: true,
    });
  }

  getPlaylists(): Promise<AxiosResponse> {
    return axios.get(`${environment.apiUrl}api/playlists`, {
      withCredentials: true,
    });
  }

  getSongs(id: string): Promise<AxiosResponse> {
    return axios.post(
      `${environment.apiUrl}api/playlistId`,
      { playlist_id: id },
      { withCredentials: true }
    );
  }

  deleteSongs(id: string, trackuris: string[]): Promise<AxiosResponse> {
    return axios.post(
      `${environment.apiUrl}api/deleteTracks`,
      { playlist_id: id, track_uris: trackuris },
      { withCredentials: true }
    );
  }

  getRecents(): Promise<AxiosResponse> {
    return axios.get(`${environment.apiUrl}api/recents`, {
      withCredentials: true,
    });
  }

  getLastMonthFavorite(): Promise<AxiosResponse> {
    return axios.get(`${environment.apiUrl}api/lastMonthFav`, {
      withCredentials: true,
    });
  }
}
