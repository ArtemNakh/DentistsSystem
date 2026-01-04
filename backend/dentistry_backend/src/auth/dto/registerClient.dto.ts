import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { BloodSign } from 'src/clients/entities/client.interface';
import { IsPasswordsMatchingConstraint } from 'src/libs/decorators/is-passwords-matching-constraint.decorator';

export class RegisterClientDto {
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name must be filling' })
  name: string;

  @IsString({ message: 'Surname must be string' })
  @IsNotEmpty({ message: 'Surname must be filling' })
  surname: string;

  @IsString({ message: 'Middle name must be string' })
  @IsNotEmpty({ message: 'Middle name must be filling' })
  middle_name: string;

  @IsDateString({}, { message: 'Birthdate must be a valid date' })
  @IsNotEmpty({ message: 'Birthdate must be filling' })
  birthdate: Date;

  @IsEnum(BloodSign, { message: 'Blood resus must be valid enum value' })
  @IsNotEmpty({ message: 'Resus blood must be filling' })
  blood_resus: BloodSign;

  @IsInt({ message: 'Blood group must be integer' })
  @Min(1, { message: 'Blood group must be at least 1' })
  @Max(4, { message: 'Blood group must be at most 4' })
  @IsNotEmpty({ message: 'Blood group must be filling' })
  blood_group: number;

  @IsString({ message: 'Phone must be string' })
  @Length(7, 30, { message: 'Phone must be between 7 and 30 characters' })
  @IsNotEmpty({ message: 'Phone must be filling' })
  phone: string;

  @IsString({ message: 'Allergic diseases must be string' })
  @IsNotEmpty({ message: 'Allergic diseases must be filling' })
  allergic_diseases: string;

  @IsString({ message: 'Email must be string' })
  @IsEmail({}, { message: 'Uncorrect format email' })
  @IsNotEmpty({ message: 'Email must be filling' })
  email: string;

  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password must be filling' })
  @MinLength(6, {
    message: 'Password must containt minimal 6 letter',
  })
  password: string;

  @IsString({ message: 'Password verification must be string' })
  @IsNotEmpty({ message: 'Password verification must be filling' })
  @MinLength(6, {
    message: 'Password verification must containt minimal 6 letter',
  })
  @Validate(IsPasswordsMatchingConstraint, {
    message: 'Password doesn`t be same',
  })
  passwordRepeat: string;
}
