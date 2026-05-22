import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IAppointment } from './entity/appointment.interface';

import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { UpdateAppointmentStatusDto } from './dto/updateAppointmentStatus.dto';
import { GetNearestDto } from './dto/Query/GetNearest.query.dto';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { GetTodaytDto } from './dto/Query/GetToday.query.dto';
import { GetAppointmentsDentistryDto } from './dto/Query/GetAppointmentsDentistry.query.dto';
import { GetHistoryDentistryDto } from './dto/Query/GetHistoryDentistry.query.dto';
import { GetWorkerAppointmentsDto } from './dto/Params/GetAppointmentsToNext3Month.param.dto';
import { UpdateAppointmentStatusParamDto } from './dto/Params/UpdateAppointmentStatus.param.dto';
import { WorkersStatsByDentistry } from './dto/Params/GetWorkersStatsByDentistry.param.dto';
import { GetClientsAppointmentParamDto } from './dto/Params/GetClientsAppointment.param.dto';
import { ClientOrWorker } from '@/auth/decorators/ClientOrWorker.decorator';
import { GetAppointmentsByClient } from './dto/Params/GetAppointmentsByClient.param.dto';
import { ClientAuthGuard } from '@/auth/guards/clientAuth.guard';

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('test/all')
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('nearest')
  @ApiOperation({
    summary: 'Отримати найближчі записи',
    description:
      'Повертає список записів (appointments), починаючи з вказаної дати.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список найближчих записів',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          client: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Nathen' },
              surname: { type: 'string', example: 'Nader' },
              middle_name: { type: 'string', example: 'Marlowe' },
              birthdate: { type: 'string', example: '2007-12-25' },
              blood_resus: { type: 'string', example: 'minus' },
              blood_group: { type: 'number', example: 1 },
              phone: { type: 'string', example: '+380681978291' },
              allergic_diseases: {
                type: 'string',
                example: 'ex temporibus eligendi',
              },
              email: { type: 'string', example: 'cricetamarinus@gmail.com' },
              isVerified: { type: 'boolean', example: false },
            },
          },
          dentist: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 65 },
              name: { type: 'string', example: 'Іван' },
              surname: { type: 'string', example: 'Петренко' },
              middle_name: { type: 'string', example: 'Олегович' },
              birthday: { type: 'string', example: '1990-05-15' },
              phone: { type: 'string', example: '+380671234567' },
              login: { type: 'string', example: 'ivan.petrenko' },
              active: { type: 'boolean', example: true },
            },
          },
          appointment_date: {
            type: 'string',
            example: '2026-05-14T08:00:00.000Z',
          },
          notes: {
            type: 'string',
            example:
              'Accusamus omnis minus libero itaque praesentium esse fugit qui.',
          },
          status: { type: 'string', example: 'wait_paid' },
          created_at: { type: 'string', example: '2024-07-18T12:02:10.000Z' },
          updated_at: { type: 'string', example: '2026-05-18T15:32:38.000Z' },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Некоректний формат дати або ID' })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Внутрішня помилка сервера' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async getNearest(@Query() query: GetNearestDto): Promise<IAppointment[]> {
    const { dentistryId, date } = query;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Некоректний формат дати');
    }

    return this.appointmentService.findNearest(parsedDate, dentistryId);
  }

  @Get('today')
  @ApiOperation({
    summary: 'Отримати записи на сьогодні',
    description:
      'Повертає список записів (appointments), у яких дата вказана сьогодні',
  })
  @ApiResponse({
    status: 200,
    description: 'Список сьогоднішніх записів',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          client: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Nathen' },
              surname: { type: 'string', example: 'Nader' },
              middle_name: { type: 'string', example: 'Marlowe' },
              birthdate: { type: 'string', example: '2007-12-25' },
              blood_resus: { type: 'string', example: 'minus' },
              blood_group: { type: 'number', example: 1 },
              phone: { type: 'string', example: '+380681978291' },
              allergic_diseases: {
                type: 'string',
                example: 'ex temporibus eligendi',
              },
              email: { type: 'string', example: 'cricetamarinus@gmail.com' },
              isVerified: { type: 'boolean', example: false },
            },
          },
          dentist: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 65 },
              name: { type: 'string', example: 'Іван' },
              surname: { type: 'string', example: 'Петренко' },
              middle_name: { type: 'string', example: 'Олегович' },
              birthday: { type: 'string', example: '1990-05-15' },
              phone: { type: 'string', example: '+380671234567' },
              login: { type: 'string', example: 'ivan.petrenko' },
              active: { type: 'boolean', example: true },
              specialty: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 2 },
                  name: {
                    type: 'string',
                    example: 'Global Operations Administrator',
                  },
                  description: {
                    type: 'string',
                    example: 'Dicta quos vel quisquam.',
                  },
                  type: { type: 'string', example: 'doctor' },
                },
              },
              dentistry: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  street: { type: 'string', example: '55438 Heaney Island' },
                  city: { type: 'string', example: 'Beckerworth' },
                  region: { type: 'string', example: 'Florida' },
                  is_active: { type: 'boolean', example: true },
                },
              },
            },
          },
          appointment_date: {
            type: 'string',
            example: '2026-05-21T08:00:00.000Z',
          },
          notes: {
            type: 'string',
            example:
              'Accusamus omnis minus libero itaque praesentium esse fugit qui.',
          },
          status: { type: 'string', example: 'wait_paid' },
          created_at: { type: 'string', example: '2024-07-18T12:02:10.000Z' },
          updated_at: { type: 'string', example: '2026-05-21T03:27:50.000Z' },
          appointment_actions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                created_at: {
                  type: 'string',
                  example: '2025-04-10T19:15:03.000Z',
                },
                updated_at: {
                  type: 'string',
                  example: '2026-04-08T18:20:38.000Z',
                },
              },
            },
          },
          payment: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              amount: { type: 'number', example: 269 },
              status_paid: { type: 'string', example: 'not_paid' },
              method_pay: { type: 'string', example: 'card' },
              payment_date: { type: 'string', example: '2026-05-04' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dentistryId має бути більше 0',
            'dentistryId має бути цілим числом',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization()
  async getTodayAppointments(
    @Query() query: GetTodaytDto,
  ): Promise<IAppointment[]> {
    const { dentistryId } = query;
    return this.appointmentService.getTodayAppointmentsByDentistry(dentistryId);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Отримання усіх записів для стоматології',
    description:
      'Повертає список записів (appointments), для певної стоматології',
  })
  @ApiResponse({
    status: 200,
    description: 'Список сьогоднішніх записів',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          client: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Nathen' },
              surname: { type: 'string', example: 'Nader' },
              middle_name: { type: 'string', example: 'Marlowe' },
              birthdate: { type: 'string', example: '2007-12-25' },
              blood_resus: { type: 'string', example: 'minus' },
              blood_group: { type: 'number', example: 1 },
              phone: { type: 'string', example: '+380681978291' },
              allergic_diseases: {
                type: 'string',
                example: 'ex temporibus eligendi',
              },
              email: { type: 'string', example: 'cricetamarinus@gmail.com' },
              isVerified: { type: 'boolean', example: false },
            },
          },
          dentist: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 65 },
              name: { type: 'string', example: 'Іван' },
              surname: { type: 'string', example: 'Петренко' },
              middle_name: { type: 'string', example: 'Олегович' },
              birthday: { type: 'string', example: '1990-05-15' },
              phone: { type: 'string', example: '+380671234567' },
              login: { type: 'string', example: 'ivan.petrenko' },
              active: { type: 'boolean', example: true },
              specialty: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 2 },
                  name: {
                    type: 'string',
                    example: 'Global Operations Administrator',
                  },
                  description: {
                    type: 'string',
                    example: 'Dicta quos vel quisquam.',
                  },
                  type: { type: 'string', example: 'doctor' },
                },
              },
              dentistry: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  street: { type: 'string', example: '55438 Heaney Island' },
                  city: { type: 'string', example: 'Beckerworth' },
                  region: { type: 'string', example: 'Florida' },
                  is_active: { type: 'boolean', example: true },
                },
              },
            },
          },
          appointment_date: {
            type: 'string',
            example: '2026-05-21T08:00:00.000Z',
          },
          notes: {
            type: 'string',
            example:
              'Accusamus omnis minus libero itaque praesentium esse fugit qui.',
          },
          status: { type: 'string', example: 'wait_paid' },
          created_at: { type: 'string', example: '2024-07-18T12:02:10.000Z' },
          updated_at: { type: 'string', example: '2026-05-21T03:27:50.000Z' },
          appointment_actions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                created_at: {
                  type: 'string',
                  example: '2025-04-10T19:15:03.000Z',
                },
                updated_at: {
                  type: 'string',
                  example: '2026-04-08T18:20:38.000Z',
                },
              },
            },
          },
          payment: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              amount: { type: 'number', example: 269 },
              status_paid: { type: 'string', example: 'not_paid' },
              method_pay: { type: 'string', example: 'card' },
              payment_date: { type: 'string', example: '2026-05-04' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dentistryId має бути більше 0',
            'dentistryId має бути цілим числом',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async getAppointmentsDentistry(
    @Query() query: GetAppointmentsDentistryDto,
  ): Promise<IAppointment[]> {
    const { dentistryId } = query;
    if (!dentistryId || isNaN(dentistryId)) {
      throw new BadRequestException(
        'Query parameter "dentistry" must be a valid number',
      );
    }
    return this.appointmentService.getAppointmentsByDentistry(dentistryId);
  }

  @Get('history')
  @ApiOperation({
    summary: 'Отрмиання історії записів для певної стоматології',
  })
  @ApiResponse({
    status: 200,
    description: 'Історія записів отримана успішно',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 23 },
          appointment_date: {
            type: 'string',
            format: 'date-time',
            example: '2025-11-02T15:00:00.000Z',
          },
          notes: {
            type: 'string',
            example: 'Et tempora eveniet rem sunt doloremque.',
          },
          status: { type: 'string', example: 'wait_paid' },
          client: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              name: { type: 'string', example: 'Leif' },
              surname: { type: 'string', example: 'Wunsch' },
              middle_name: { type: 'string', example: 'Reagan' },
              birthdate: {
                type: 'string',
                format: 'date',
                example: '1967-01-15',
              },
              phone: { type: 'string', example: '916-106-0493' },
              blood_group: { type: 'number', example: 2 },
              blood_resus: { type: 'string', example: 'plus' },
              allergic_diseases: {
                type: 'string',
                example: 'minima velit ullam',
              },
              email: { type: 'string', example: 'Albin75@hotmail.com' },
              isVerified: { type: 'boolean', example: false },
            },
          },
          dentist: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 21 },
              name: { type: 'string', example: 'Marcelino' },
              surname: { type: 'string', example: 'Ullrich' },
              middle_name: { type: 'string', example: 'Bailey' },
              birthday: {
                type: 'string',
                format: 'date',
                example: '1962-10-03',
              },
              phone: { type: 'string', example: '740-012-0150' },
              dentistry: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 2 },
                  street: { type: 'string', example: '7090 Gorczany Way' },
                  city: { type: 'string', example: 'Fort Micah' },
                  region: { type: 'string', example: 'Alabama' },
                  is_active: { type: 'boolean', example: true },
                },
              },
              login: { type: 'string', example: 'Mireya.Ondricka48' },
              active: { type: 'boolean', example: true },
            },
          },
          appointment_actions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 137 },
                operation: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 14 },
                    name: {
                      type: 'string',
                      example: 'Handcrafted Cotton Bike',
                    },
                    description: {
                      type: 'string',
                      example:
                        'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
                    },
                    price: { type: 'number', example: 292 },
                    active: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          payment: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 12 },
              amount: { type: 'number', example: 2167 },
              status_paid: { type: 'string', example: 'not_paid' },
              method_pay: { type: 'string', example: 'card' },
              payment_date: {
                type: 'string',
                format: 'date',
                example: '2026-01-21',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр запиту',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['dentistryId має бути більше 0'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async getHistoryByDentistry(
    @Query() query: GetHistoryDentistryDto,
  ): Promise<IAppointment[]> {
    const { dentistryId } = query;
    if (!dentistryId || isNaN(dentistryId)) {
      throw new BadRequestException(
        'Query parameter "dentistry" must be a valid number',
      );
    }

    return this.appointmentService.getHistoryByDentistry(dentistryId);
  }

  @Post('add_new')
  @ApiOperation({
    summary: 'Створити новий запис',
    description:
      'Додає новий запис (appointment) для пацієнта у вказаній стоматології. ' +
      'Необхідно передати дані клієнта, лікаря, дату прийому та додаткові нотатки.',
  })
  @ApiResponse({
    status: 201,
    description: 'Запис успішно створено',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1427 },
        appointment_date: {
          type: 'string',
          format: 'date-time',
          example: '2026-03-05T10:00:00',
        },
        notes: { type: 'string', example: 'Біль при прийомі їжі' },
        status: { type: 'string', example: 'schedule' },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2026-05-21T14:54:09.000Z',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2026-05-21T14:54:09.000Z',
        },
        client: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 12 },
          },
        },
        dentist: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр запиту',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['dentistryId має бути більше 0'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Внутрішня помилка сервера' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<IAppointment> {
    try {
      const newAppointment =
        await this.appointmentService.createAppointment(createAppointmentDto);
      return newAppointment;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':workerId/appointments/next/3month')
  @ApiResponse({
    status: 200,
    description: 'Записи для працівника на наступні 3 місяці отримано успішно',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          appointment_date: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-24T08:00:00.000Z',
          },
          notes: {
            type: 'string',
            example:
              'Accusamus omnis minus libero itaque praesentium esse fugit qui.',
          },
          status: { type: 'string', example: 'wait_paid' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-07-18T12:02:10.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-21T15:07:54.000Z',
          },
          client: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Nathen' },
              surname: { type: 'string', example: 'Nader' },
              middle_name: { type: 'string', example: 'Marlowe' },
              birthdate: {
                type: 'string',
                format: 'date',
                example: '2007-12-25',
              },
              blood_resus: { type: 'string', example: 'minus' },
              blood_group: { type: 'number', example: 1 },
              phone: { type: 'string', example: '+380681978291' },
              allergic_diseases: {
                type: 'string',
                example: 'ex temporibus eligendi',
              },
              email: { type: 'string', example: 'cricetamarinus@gmail.com' },
              isVerified: { type: 'boolean', example: false },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-04-08T15:20:33.000Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-14T15:20:20.000Z',
              },
            },
          },
          dentist: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 65 },
              name: { type: 'string', example: '1Іван' },
              surname: { type: 'string', example: '1Петренко' },
              middle_name: { type: 'string', example: '1Олегович' },
              birthday: {
                type: 'string',
                format: 'date',
                example: '1990-05-15',
              },
              phone: { type: 'string', example: '+380671234567' },
              login: { type: 'string', example: '1ivan.petrenko' },
              active: { type: 'boolean', example: true },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-04-21T17:29:54.000Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-04-21T17:31:32.000Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр запиту',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['dentistryId має бути більше 0'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization()
  async getAppointments(@Param() params: GetWorkerAppointmentsDto) {
    const { workerId } = params;
    return this.appointmentService.findAppointmentsForWorkerToNext3Month(
      workerId,
    );
  }

  @Get(':workerId/appointments')
  @ApiResponse({
    status: 200,
    description: 'Записи для працівника на наступні 3 місяці отримано успішно',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          appointment_date: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-24T08:00:00.000Z',
          },
          notes: {
            type: 'string',
            example:
              'Accusamus omnis minus libero itaque praesentium esse fugit qui.',
          },
          status: { type: 'string', example: 'wait_paid' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-07-18T12:02:10.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-21T15:07:54.000Z',
          },
          client: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Nathen' },
              surname: { type: 'string', example: 'Nader' },
              middle_name: { type: 'string', example: 'Marlowe' },
              birthdate: {
                type: 'string',
                format: 'date',
                example: '2007-12-25',
              },
              blood_resus: { type: 'string', example: 'minus' },
              blood_group: { type: 'number', example: 1 },
              phone: { type: 'string', example: '+380681978291' },
              allergic_diseases: {
                type: 'string',
                example: 'ex temporibus eligendi',
              },
              email: { type: 'string', example: 'cricetamarinus@gmail.com' },
              isVerified: { type: 'boolean', example: false },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-04-08T15:20:33.000Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-14T15:20:20.000Z',
              },
            },
          },
          dentist: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 65 },
              name: { type: 'string', example: '1Іван' },
              surname: { type: 'string', example: '1Петренко' },
              middle_name: { type: 'string', example: '1Олегович' },
              birthday: {
                type: 'string',
                format: 'date',
                example: '1990-05-15',
              },
              phone: { type: 'string', example: '+380671234567' },
              login: { type: 'string', example: '1ivan.petrenko' },
              active: { type: 'boolean', example: true },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-04-21T17:29:54.000Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-04-21T17:31:32.000Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр запиту',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['dentistryId має бути більше 0'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Працівника не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization()
  async getAppointmentsByWorker(
    @Param() params: GetWorkerAppointmentsDto,
  ): Promise<IAppointment[]> {
    const { workerId } = params;
    return this.appointmentService.findAppointmentsForWorker(workerId);
  }

  @Patch(':appointmentId/update_status')
  @ApiOperation({ summary: 'Оновлення статусу запису' })
  @ApiBody({ type: UpdateAppointmentStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Статус запису успішно оновлено',
    schema: {
      example: {
        message: {
          code: 'success',
          text: 'Appointment 1940 status updated to cancelled',
        },
        data: [
          {
            id: 1940,
            status: 'cancelled',
            updated_at: '2026-03-14T21:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'appointment не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async updateStatus(
    @Param() params: UpdateAppointmentStatusParamDto,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    const { appointmentId } = params;
    return this.appointmentService.updateStatus(appointmentId, dto.status);
  }

  @Get('workers-stats/:dentistryId')
  @ApiOperation({
    summary: 'Отримання статистики для стоматології',
  })
  @ApiResponse({
    status: 200,
    description: 'Статистика працівників стоматології отримана успішно',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          worker: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 20 },
              name: { type: 'string', example: 'Pablo' },
              surname: { type: 'string', example: 'Wilderman' },
              specialty: {
                type: 'string',
                example: 'Forward Implementation Agent',
              },
            },
          },
          stats: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 27 },
              schedule: { type: 'number', example: 10 },
              completed: { type: 'number', example: 7 },
              waitPaid: { type: 'number', example: 7 },
              cancelled: { type: 'number', example: 3 },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dentistryId має бути більше 0',
            'dentistryId має бути цілим числом',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'appointment не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getWorkersStatsByDentistry(@Param() params: WorkersStatsByDentistry) {
    const { dentistryId } = params;
    return this.appointmentService.getWorkerAppointmentsStatsByDentistry(
      dentistryId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description:
      'Повертає повний запис (appointment) разом із клієнтом, стоматологом, діями (appointment_actions) та оплатою. ' +
      'Використовується для отримання детальної інформації про конкретний прийом.',
  })
  @ApiResponse({
    status: 200,
    description: 'Повний запис із усіма зв’язками',
    schema: {
      example: {
        id: 1,
        client: {
          id: 1,
          name: 'Gerry',
          surname: 'Hoppe',
          middle_name: 'Kyle',
          birthdate: '1973-02-02',
          blood_resus: 'plus',
          blood_group: 3,
          phone: '552-540-1913',
          allergic_diseases: 'dignissimos itaque sequi',
          email: 'Osvaldo_Reinger@hotmail.com',
          password: 'fp5GQiFCZq',
          isVerified: false,
          created_at: '2026-03-23T18:33:33.000Z',
          updated_at: '2026-03-23T18:33:33.000Z',
        },
        dentist: {
          id: 8,
          name: 'Cicero',
          surname: 'Weimann',
          middle_name: 'Sasha',
          birthday: '1974-11-11',
          phone: '237-649-5228',
          login: 'Kasey15',
          password: 'nXP7CU_dZn',
          created_at: '2026-03-23T18:33:33.000Z',
          updated_at: '2026-03-23T18:33:33.000Z',
          active: true,
        },
        appointment_date: '2026-03-06T16:00:00.000Z',
        notes: 'Optio expedita dolorum dolores.',
        status: 'completed',
        created_at: '2025-08-28T23:54:28.000Z',
        updated_at: '2026-03-23T20:33:37.000Z',
        appointment_actions: [
          {
            id: 1,
            operation: {
              id: 7,
              name: 'Sleek Wooden Pants',
              description: 'Andy shoes are designed...',
              price: 792,
              active: true,
              created_at: '2026-03-23T18:33:33.000Z',
              updated_at: '2026-03-23T18:33:33.000Z',
            },
            created_at: '2025-05-29T11:55:04.000Z',
            updated_at: '2026-03-23T20:33:40.000Z',
          },
        ],
        payment: {
          id: 1,
          amount: 2836,
          status_paid: 'not_paid',
          method_pay: 'cash',
          payment_date: '2025-04-02',
          created_at: '2025-10-07T03:29:34.000Z',
          updated_at: '2026-03-23T20:33:56.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'appointment не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ClientOrWorker()
  async getAppointment(
    @Param() params: GetClientsAppointmentParamDto,
  ): Promise<IAppointment> {
    const { appointmentId } = params;
    return this.appointmentService.getAppointmentById(appointmentId);
  }

  @Get('client/:clientId')
  @ApiOperation({
    summary: 'Отримання всіх записів клієнта',
    description:
      'Повертає список усіх записів (appointments) для конкретного клієнта за його ідентифікатором. Включає інформацію про клієнта, стоматолога, дії та оплату.',
  })
  @ApiResponse({
    status: 200,
    description: 'Записи отримано успішно',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 161 },
          appointment_date: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-12T17:00:00.000Z',
          },
          notes: {
            type: 'string',
            example:
              'Totam tenetur perferendis similique occaecati consequatur.',
          },
          status: { type: 'string', example: 'cancelled' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-02-14T16:34:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-08T18:20:37.000Z',
          },
          client: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 12 },
              name: { type: 'string', example: 'Rosemarie' },
              surname: { type: 'string', example: 'Powlowski-Bednar' },
              middle_name: { type: 'string', example: 'Jaden' },
              birthdate: {
                type: 'string',
                format: 'date',
                example: '1959-06-07',
              },
              blood_resus: { type: 'string', example: 'plus' },
              blood_group: { type: 'number', example: 3 },
              phone: { type: 'string', example: '711-287-6252' },
              allergic_diseases: {
                type: 'string',
                example: 'eaque reprehenderit occaecati',
              },
              email: { type: 'string', example: 'Jacques_Hackett@hotmail.com' },
              isVerified: { type: 'boolean', example: false },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-04-08T15:20:33.000Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-04-08T15:20:33.000Z',
              },
            },
          },
          dentist: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              name: { type: 'string', example: 'Savanah' },
              surname: { type: 'string', example: 'Watsica' },
              middle_name: { type: 'string', example: 'Jaden' },
              birthday: {
                type: 'string',
                format: 'date',
                example: '1966-03-16',
              },
              phone: { type: 'string', example: '206-229-4964' },
              login: { type: 'string', example: 'Angie7' },
              active: { type: 'boolean', example: true },
              specialty: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 34 },
                  name: {
                    type: 'string',
                    example: 'Legacy Usability Director',
                  },
                  description: {
                    type: 'string',
                    example:
                      'Et culpa vitae voluptatem repellat corrupti placeat assumenda officia saepe.',
                  },
                  type: { type: 'string', example: 'doctor' },
                },
              },
              dentistry: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  street: { type: 'string', example: '55438 Heaney Island' },
                  city: { type: 'string', example: 'Beckerworth' },
                  region: { type: 'string', example: 'Florida' },
                  is_active: { type: 'boolean', example: true },
                },
              },
            },
          },
          appointment_actions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 862 },
                operation: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    name: {
                      type: 'string',
                      example: 'Intelligent Plastic Salad',
                    },
                    description: {
                      type: 'string',
                      example:
                        "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
                    },
                    price: { type: 'number', example: 269 },
                    active: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          payment: {
            type: 'object',
            nullable: true,
            example: null,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований користувач',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dentistryId має бути більше 0',
            'dentistryId має бути цілим числом',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  // @UseGuards(ClientAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getAppointmentsByClient(@Param() params: GetAppointmentsByClient) {
    const { clientId } = params;
    return this.appointmentService.findByClientId(clientId);
  }
}
