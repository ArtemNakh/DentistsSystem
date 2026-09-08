import { ClientCommonDto } from "@/clients/dto/Response/BaseType/ClientCommon.response.dto";
import { Expose, Type } from "class-transformer";

export class LoginClientResponseDto 
{

      @Expose()
  authToken: string;

  @Expose()
  @Type(() => ClientCommonDto)
  client: ClientCommonDto;
}