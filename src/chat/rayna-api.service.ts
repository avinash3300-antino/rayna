import axios, { AxiosInstance, AxiosError } from "axios";
import { config } from "../config";
import type { ToolName } from "./tools";

// ─────────────────────────────────────────────────────────
// RaynaApiService
// Executes tool calls → real Rayna Tours API calls
// Each case maps directly to one API endpoint from the docs
// ─────────────────────────────────────────────────────────
export class RaynaApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.rayna.baseUrl,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    // Request logging
    this.client.interceptors.request.use((req) => {
      console.log(`[Rayna API] ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`, req.params);
      return req;
    });

    // Response logging
    this.client.interceptors.response.use(
      (res) => {
        console.log(`[Rayna API] Response ${res.status} from ${res.config.url}`);
        return res;
      },
      (err: AxiosError) => {
        console.error(`[Rayna API] Error ${err.response?.status}: ${err.message}`);
        return Promise.reject(err);
      }
    );
  }

  // ─────────────────────────────────────────────────────────
  // execute() — called by ChatService for each tool use block
  // Returns: JSON string (Claude reads this as tool result)
  // ─────────────────────────────────────────────────────────
  async execute(toolName: ToolName, input: Record<string, unknown>): Promise<string> {
    try {
      const data = await this.callApi(toolName, input);
      return JSON.stringify({ success: true, data });
    } catch (err) {
      const error = err as AxiosError;
      console.error(`[RaynaApiService] Tool "${toolName}" failed:`, error.message);
      return JSON.stringify({
        success: false,
        error: error.message,
        status: error.response?.status,
        hint: "API call failed. Tell user data is temporarily unavailable.",
      });
    }
  }

  private async callApi(toolName: ToolName, input: Record<string, unknown>): Promise<unknown> {
    switch (toolName) {
      // ── GET /api/available-cities?productType=tour ──
      case "get_available_cities": {
        const { data } = await this.client.get("/available-cities", {
          params: { productType: input.productType },
        });
        return data;
      }

      // ── GET /api/all-products?productType=tour&cityId=13668... ──
      case "get_all_products": {
        const { data } = await this.client.get("/all-products", {
          params: {
            productType: input.productType,
            cityId: input.cityId,
            cityName: input.cityName,
            countryName: input.countryName,
          },
        });
        return data;
      }

      // ── GET /api/city/products?cityId=13668 ──
      case "get_city_products": {
        const { data } = await this.client.get("/city/products", {
          params: { cityId: input.cityId },
        });
        return data;
      }

      // ── GET /api/city/holiday?cityId=13668 ──
      case "get_city_holiday_packages": {
        const { data } = await this.client.get("/city/holiday", {
          params: { cityId: input.cityId },
        });
        return data;
      }

      // ── GET /api/city/cruise?cityId=13668 ──
      case "get_city_cruises": {
        const { data } = await this.client.get("/city/cruise", {
          params: { cityId: input.cityId },
        });
        return data;
      }

      // ── GET /api/city/yacht?cityId=13668 ──
      case "get_city_yachts": {
        const { data } = await this.client.get("/city/yacht", {
          params: { cityId: input.cityId },
        });
        return data;
      }

      // ── GET /api/product-details?url=<encoded-url> ──
      case "get_product_details": {
        const { data } = await this.client.get("/product-details", {
          params: { url: input.url },
        });
        return data;
      }

      // ── Milestone 2 (not active yet) ──
      // case "get_user_profile": ...
      // case "update_user_profile": ...

      // ── Milestone 3 (not active yet) ──
      // case "get_user_bookings": ...
      // case "get_payment_history": ...

      default: {
        throw new Error(`Unknown tool: ${toolName}`);
      }
    }
  }
}