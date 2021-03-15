import Axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Intent, AIIntent, CreateIntentRes } from '@app/ai/types';

type UnknownObject = {
  [key: string]: unknown;
};

@Injectable()
export class AIService {
  private readonly axios: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axios = Axios.create({
      baseURL: this.configService.get('AIUrl'),
    });
  }

  async getIntents(message: string): Promise<AIIntent[]> {
    return this.apiRequest({
      method: 'POST',
      path: '/intents/ai',
      body: { message },
    }) as Promise<AIIntent[]>;
  }

  async createIntent(intent: Intent): Promise<CreateIntentRes> {
    return this.apiRequest({
      method: 'POST',
      path: '/intents',
      body: intent,
    }) as Promise<CreateIntentRes>;
  }

  async deleteIntent(id: string): Promise<void> {
    return this.apiRequest({
      method: 'DELETE',
      path: `/intents/${id}`,
    }) as Promise<void>;
  }

  async apiRequest({
    method,
    path,
    body,
    params,
    headers,
  }: {
    method: string;
    path: string;
    body?: unknown;
    params?: UnknownObject;
    headers?: UnknownObject;
  }): Promise<unknown> {
    try {
      const request: AxiosRequestConfig = {
        method: method as Method,
        url: path,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
        responseType: 'json',
      };
      if (body) request.data = body;
      if (params) request.params = params;
      return (await this.axios.request(request)).data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
