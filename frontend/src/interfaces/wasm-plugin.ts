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
  imagePullPolicy?: string;
  imagePullSecret?: string;
  customConfigs?: {
    [key: string]: string;
  };
  enabled?: boolean;
  internal?: boolean;
  resKey?: string;
  key?: string;
  [key: string]: any;
}

export enum ImagePullPolicy {
  UNSPECIFIED = "UNSPECIFIED_POLICY",
  IF_NOT_PRESENT = "IfNotPresent",
  ALWAYS = "Always",
}

export enum PluginPhase {
  UNSPECIFIED = "UNSPECIFIED_PHASE",
  AUTHN = "AUTHN",
  AUTHZ = "AUTHZ",
  STATS = "STATS",
}