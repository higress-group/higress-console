import { getDomainPluginInstance, getDomainPluginInstances } from "@/services";
import message from "antd/lib/message";
import { WasmPluginData } from "./route";

export interface Domain {
  name: string;
  version?: string;
  certIdentifier?: string;
  enableHttps?: string;
  [propName: string]: any;
}

export const Protocol = {
  http: 'HTTP',
  https: 'HTTPS',
};

export enum EnableHttpsValue {
  on = 'on',
  off = 'off',
  force = 'force',
}

export interface DomainResponse {
  data: Domain[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export const DEFAULT_DOMAIN = "higress-default-domain";

export const fetchPluginsByDomain = async (record: Domain): Promise<WasmPluginData[]> => {
  const data: Record<string, WasmPluginData[]> = {};
  try {
    const response = await getDomainPluginInstances(record.name);
    const plugins = response.map((plugin: { pluginName: any; description: any; enabled: any; internal: any }) => {
      return {
        ...plugin,
        name: plugin.pluginName,
        enabled: plugin.enabled,
        internal: plugin.internal,
      };
    });
    data[record.name] = plugins || [];
  } catch (error) {
    message.error(`Failed to fetch strategies: ${error.message || error}`);
  }

  return data[record.name] || [];
};
