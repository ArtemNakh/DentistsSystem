import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmationDto {
	@IsString({ message: 'Токен повинен бути строкою' })
	@IsNotEmpty({ message: 'Поле токен не може бути пустим' })
	token: string
}
