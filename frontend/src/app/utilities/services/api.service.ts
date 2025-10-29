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

  getSongs(id: string): Promise<AxiosResponse> {
    return axios.post(
      `${environment.apiUrl}playlistId`,
      { playlist_id: id },
      { withCredentials: true }
    );
  }

  deleteSongs(id: string, trackuris: string[]): Promise<AxiosResponse> {
    return axios.post(
      `${environment.apiUrl}deleteTracks`,
      { playlist_id: id, track_uris: trackuris },
      { withCredentials: true }
    );
  }
}
