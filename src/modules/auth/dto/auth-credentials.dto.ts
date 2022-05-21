import { IsEnum ,Length ,IsString, IsEmail} from "class-validator";

export class AuthCredentialsDto {

  username: string;

  email: string;

  password: string;
  
  
}
