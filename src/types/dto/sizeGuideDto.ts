import { getManyBaseDto } from "./baseDto";

export class GetSizeGuideDto extends getManyBaseDto {
  name?: string;
}

export class CreateSizeGuideDto {
  id?: number;
  name?: string;
  topText?: string;
  content?: string;
  bottomText?: string;
  status?: boolean;
  products?: string[];
  tags?: string[];
  collections?: string[];
  variants?: string[];
  default?: boolean;
}
