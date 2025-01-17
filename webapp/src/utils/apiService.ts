import AppAuthProvider from "@context/authContext";
import axios, { AxiosInstance } from "axios";
import * as rax from "retry-axios";

export class APIService {
  private static _instance: AxiosInstance;
  private static _idToken: string;

  constructor(idToken: string, callback: () => Promise<{ idToken: string }>) {
    APIService._instance = axios.create();
    rax.attach(APIService._instance);

    APIService._idToken = idToken;
    APIService.updateRequestInterceptor();

    (APIService._instance.defaults as unknown as rax.RaxConfig).raxConfig = {
      retry: 3,
      instance: APIService._instance,
      httpMethodsToRetry: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      statusCodesToRetry: [[400, 401]],
      retryDelay: 100,

      onRetryAttempt: async (err) => {
        const cfg = rax.getConfig(err);

        var res = await callback();

        APIService.updateTokens(res.idToken);

        APIService._instance.interceptors.request.clear();
        APIService.updateRequestInterceptor();
      },
    };
  }

  public static getInstance(): AxiosInstance {
    return APIService._instance;
  }

  private static updateTokens(idToken: string) {
    APIService._idToken = idToken;
  }

  private static updateRequestInterceptor() {
    APIService._instance.interceptors.request.use(
      (config) => {
        config.headers.set("Authorization", "Bearer " + APIService._idToken);
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
  }
}
