import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export interface InvalidControl {
	fieldName: string;
	control: AbstractControl;
}

export interface InvalidControlErrors extends InvalidControl {
	errors: ValidationErrors;
}

export interface ValidatorConfig {
	fieldName: string;
	validators: ValidatorFn[];
}

export type FormControlType = 'FormGroup' | 'FormArray' | 'FormControl';
export type FormControlStatus = 'VALID' | 'INVALID' | 'DISABLED' | 'PENDING';

