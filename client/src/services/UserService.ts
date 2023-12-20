import { IUser } from './../../models/IUser';
import $api from '../http';
import { AxiosResponse } from 'axios';

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>('/users');
  }
}
