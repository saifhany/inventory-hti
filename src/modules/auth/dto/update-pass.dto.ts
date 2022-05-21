import { IsEnum ,Length ,isString} from "class-validator";

export class UpdatePasswordDto {

    @Length(6, 10)
    password: string;
  }
  