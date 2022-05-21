import { IsEnum,IsOptional } from "class-validator";
import { Role } from "../../../commons/enums/role.enum";
import { SECTION } from "../../../commons/enums/section.type";
import { Branch } from "../../../commons/enums/branch.entity";

export class UserRoleDto {
    @IsOptional()
    @IsEnum(Role)
    type:Role;

    @IsOptional()
    @IsEnum(SECTION)
    section?: SECTION;
    
    @IsOptional()
    @IsEnum(Branch)
    branch?: Branch;

    
}