import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class LoginClientDto {
	@IsString({ message: 'Email must be string' })
	@IsEmail({}, { message: 'Uncorrect format email' })
	@IsNotEmpty({ message: 'Email must be filling' })
	email: string

	@IsString({ message: 'Password must be string' })
	@IsNotEmpty({ message: 'Password must be filling' })
	@MinLength(6, {
		message: 'Password must containt minimal 6 letter'
	})
	password: string

	
}
