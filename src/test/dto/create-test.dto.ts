import { IsNumber, IsString } from "class-validator";

export class CreateTestDto {
    @IsString()
    readonly name: string;

    @IsNumber()
    readonly age: number;
}
