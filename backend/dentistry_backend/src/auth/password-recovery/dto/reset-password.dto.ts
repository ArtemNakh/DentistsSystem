import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResetPasswordDto {
	@IsEmail({}, { message: 'введіть коректний адрес електронний пошти' })
	@IsNotEmpty({ message: 'Поле email не може бути пустим' })
	email: string
}
