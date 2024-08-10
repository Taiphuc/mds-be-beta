import { getManyBaseDto } from "./baseDto";

export class GetThemesDto extends getManyBaseDto {
  name?: string;
}

export class CreateThemeDto {
  id?: number;
  name?: string;
  metadata?: any;
  pages?: number[];
  settings?: any;
  status?: boolean;
}