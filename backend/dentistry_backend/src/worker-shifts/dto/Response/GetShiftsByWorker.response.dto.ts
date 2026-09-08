import { WorkerCommonDto } from "@/workers/dto/Response/BaseType/WorkersCommon.response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { WorkerShiftCommonDto } from "./BaseType/WorkerShiftCommon.response.dto";
import { WorkerWithSpecialtyDto } from "@/workers/dto/Response/BaseType/partials/WorkerWithSpecialty.response.dto";

export class GetShiftsByWorkerResponseDto extends WorkerShiftCommonDto {

    @ApiProperty({
        description: 'Працівник, у якого є розклад',
        type: WorkerWithSpecialtyDto,
      })
      @ApiProperty({ type: () => WorkerWithSpecialtyDto })
      @Type(() => WorkerWithSpecialtyDto)
      @Expose()
      worker: WorkerWithSpecialtyDto;
}
