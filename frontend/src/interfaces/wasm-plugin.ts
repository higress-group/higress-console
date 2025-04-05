
export interface WasmPluginData {
  id?: string;
  name: string;
  version?: string;
  category?: string;
  title?: string;
  description?: string;
  icon?: string;
  builtIn?: boolean;
  imageRepository?: string;
  imageVersion?: string;
  phase?: string;
  priority?: number;
  customConfigs?: {
    [key: string]: string;
  };
  enabled?: boolean;
  internal?: boolean;
  resKey?: string;
  key?: string;
}
