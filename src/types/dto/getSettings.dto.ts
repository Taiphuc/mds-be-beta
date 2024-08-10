export class GetSettingsDto {
  scope?: "admin" | "store";
  type?: string;
}
export class GetSettingDto {
  scope?: "admin" | "store";
  type?: string;
  key?: string;
}