import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class NewPasswordDto {
	@IsString({ message: 'Пароль повинен бути строкою' })
	@MinLength(6, { message: 'Пароль повинен содержати не меньше 6 символів' })
	@IsNotEmpty({ message: 'Поле новий пароль не може бути пустим' })
	password: string
}
