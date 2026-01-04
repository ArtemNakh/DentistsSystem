

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { RegisterClientDto } from "src/auth/dto/registerClient.dto";

 @ValidatorConstraint({name:'IsPasswordMathcing',async:false})
 export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface
 {
    public validate(passwordRepeat:string,args:ValidationArguments){
        const obj = args.object as RegisterClientDto
        return obj.password === passwordRepeat
    }

    public defaultMEssage(validationArguments?:ValidationArguments)
    {
        return 'Password are not match'
    }
 }