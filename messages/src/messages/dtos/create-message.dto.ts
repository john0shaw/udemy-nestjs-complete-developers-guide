import { IsString, IsBoolean } from "class-validator";

export class CreateMessageDto {
    @IsString()
    content: string;
}