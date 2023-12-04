import {Injectable} from '@angular/core';
import {
	AbstractControl,
	AbstractControlOptions,
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn
} from '@angular/forms';
import {Logger} from '@core/services/logger/logger';
import {ServiceLocator} from '@core/services/service-locator';
import {
	FormControlType,
	InvalidControl,
	InvalidControlErrors,
	ValidatorConfig
} from '@shared/services/form-helper/form-helper.service';
import {DateFns} from '@shared/utils/date-fns.utils';

export interface BooleanArrayDefinition {
	possibleValues: string[];
	initialValue?: string[];
	booleanArray?: boolean[];
}

export type FormGroupObject = {[key: string]: any};
export type FormGroupConfig = AbstractControlOptions | FormGroupObjectConfig;
/**
 * Key must exist in FormGroupObject. The value of that key will be
 * an AbstractControlOptions object which will be applied to a FormControl
 */
export type FormGroupObjectConfig = {[key in keyof FormGroupObject]: FormGroupConfig};

@Injectable({
	providedIn: 'root'
})
export class FormBuilderService {

	constructor() {}

	/**
	 * Take an object with values and build a FormGroup from it. If that object contains
	 * array values a FormArray will be created. If the obj contains a property that is an object
	 * another FormGroup will be created.
	 *
	 * The biggest draw back to using this method is you will have to manually create validators
	 * @param obj
	 * @param objConfig
	 * @example
	 *
	 * const someObj = {foo: 'bar', bar: 'baz', baz: [1,2], boo: {abc: 123}}
	 * const someObjFormGroup = FormBuilderService.convertObjToFormGroup(someObj);
	 * console.log('someObjFormGroup.controls=', someObjFormGroup.controls);
	 * {
	 *   foo: FormControl,
	 *   bar: FormControl,
	 *   baz: FormArray (controls: {0: 1 (FormControl), 1: 2 (FormControl)}),
	 *   boo: FormGroup (controls: {abc: 123 (FormControl)})
	 * }
	 *
	 * // with options
	 * const someObj = {foo: 'bar', bar: 'baz', baz: [1,2], boo: {abc: 123}}
	 * const someObjOptions = {foo: {updateOn: 'blur'}}
	 * const someObjFormGroup = FormBuilderService.convertObjToFormGroup(someObj, someObjOptions);
	 * console.log('someObjFormGroup.controls=', someObjFormGroup.controls);
	 * {
	 *   foo: FormControl,
	 *   bar: FormControl,
	 *   baz: FormArray (controls: {0: 1 (FormControl), 1: 2 (FormControl)}),
	 *   boo: FormGroup (controls: {abc: 123 (FormControl)})
	 * }
	 */
	static convertObjToFormGroup(obj: FormGroupObject, objConfig?: FormGroupObjectConfig): FormGroup {
		if (obj !== null && obj !== undefined && typeof obj !== 'boolean') {
			let fb = ServiceLocator.injector?.get(FormBuilder);
			if (!fb) {
				fb = new FormBuilder();
			}
			if (fb) {
				const group = fb.group({});
				Object.keys(obj).forEach((key) => {
					const controlConfig = objConfig ? objConfig[key] : undefined;
					const keyVal = obj[key];
					if (Array.isArray(keyVal)) {
						const formArr = this.convertArrayToFormArray(keyVal);
						group.addControl(key, formArr);
					} else if (keyVal instanceof Date) {
						const dateCtl = fb.control(keyVal, controlConfig);
						group.addControl(key, dateCtl);
					} else if (keyVal !== null && typeof keyVal === 'object') { // typeof null = 'object' so take that into account
						const childGrp = this.convertObjToFormGroup(keyVal, controlConfig as any);
						group.addControl(key, childGrp);
					} else if (typeof keyVal === 'string' || typeof keyVal === 'number' || typeof keyVal === 'boolean') {
						const ctrl = fb.control(keyVal, controlConfig);
						group.addControl(key, ctrl);
					} else {
						const emptyCtl = fb.control(keyVal, controlConfig);
						group.addControl(key, emptyCtl);
					}
				});
				return group;
			}
		}
		// throw new Error('Nothing provided to convertObjToFormGroup');
		Logger.warn('Nothing provided to convertObjToFormGroup', obj);
	}

	/**
	 * Take an array of items and convert them to a FormArray. This is for an array of objects,
	 * array of boolean will not work
	 * @param arr
	 * @param forCheckboxes
	 */
	static convertArrayToFormArray(arr: any[], forCheckboxes: boolean = false): FormArray {
		let fb = ServiceLocator.injector?.get(FormBuilder);
		if (!fb) {
			fb = new FormBuilder();
		}
		if (fb && !forCheckboxes) {
			let valArr = [];
			if (arr?.length) {
				valArr = arr.map((obj) => {
					if (typeof obj === 'boolean' || typeof obj === 'string' || typeof obj === 'number' || obj instanceof Date) {
						return new FormControl(obj);
					} else if (obj !== null && typeof obj === 'object') {
						return FormBuilderService.convertObjToFormGroup(obj);
					} else if (Array.isArray(obj)) {
						return FormBuilderService.convertArrayToFormArray(obj);
					} else {
						return new FormControl(obj);
					}
				});
			}
			return fb.array(valArr);
		} else {
			// todo: implement a checkbox solution to prevent ending up with an array of booleans instead of an array of objects
		}
	}

	/**
	 * Get the controls in a form group as an array (not a FormArray) in order to loop through them
	 * and do something to the individual controls. FormGroup.controls returns an object.
	 * @param formGroup
	 */
	static formGroupControlsToArray(formGroup: FormGroup): AbstractControl[] {
		const returnVal = [];
		if (formGroup?.controls) {
			Object.keys(formGroup.controls).forEach((key) => {
				returnVal.push(formGroup.get(key));
			});
		}
		return returnVal;
	}

	/**
	 * returns just the invalid children of the provided FormGroup. If a child is an invalid FormGroup or FormArray will return
	 * the FormGroup/FormArray and NOT it's invalid FormControls
	 * @param formGroup
	 */
	static getInvalidFormGroupControls(formGroup: FormGroup): InvalidControl[] {
		const returnVal = [];
		if (formGroup?.controls) {
			Object.keys(formGroup.controls).forEach((key) => {
				const ctrl = formGroup.get(key);
				if (ctrl.invalid) {
					returnVal.push({fieldName: key, control: ctrl});
				}
			});
		}
		return returnVal;
	}

	/**
	 * Sets validators on a FormGroup based on the ValidatorConfig. If
	 * validatorConfigs is an empty array, will remove all validators for each
	 * control in the formGroup.
	 *
	 * NOTE: If your formGroup contains formGroups or FormArrays, will not recursively add validators
	 * to child FormGroups, only top level controls
	 *
	 * @param validatorConfigs
	 * @param formGroup
	 * @example
	 *
	 * const fg = FormBuilderService.convertObjToFormGroup({firstName: 'foo'});
	 * const validators: ValidatorConfig[] = [
	 * 	{fieldName: 'firstName', validators: [Validators.required]}
	 * ];
	 * FormBuilderService.setFormGroupValidators(validators, fg);
	 */
	static setFormGroupValidators(validatorConfigs: ValidatorConfig[], formGroup: FormGroup) {
		const formGroupKeys = Object.keys(formGroup?.controls || {});
		if (validatorConfigs && formGroupKeys.length) {
			formGroupKeys.forEach((ctrlFieldName) => {
				const fgControl = formGroup.get(ctrlFieldName);
				const controlValidators = validatorConfigs.find(validator => validator.fieldName === ctrlFieldName)?.validators;
				if (controlValidators?.length) {
					fgControl.setValidators(controlValidators);
				} else {
					fgControl.clearValidators();
				}
			});
		}else if (!validatorConfigs || !formGroup) {
			const missingArgs = !validatorConfigs
				? {arg: 'validatorConfigs', value: validatorConfigs}
				: !formGroup
					? {arg: 'formGroup', value: formGroup}
					: !validatorConfigs && !formGroup
						? {arg: 'both', value: [validatorConfigs, formGroup]}
						: {arg: 'nothing', value: undefined};
			console.warn(`[FormBuilderService.setFormGroupValidators] Missing arguments ${missingArgs.arg} (${missingArgs.value})`);
		}else if (!formGroupKeys.length) {
			console.warn(`[FormBuilderService.setFormGroupValidators] FormGroup ${FormBuilderService.getControlName(formGroup)} contains 0 controls`,
				validatorConfigs, formGroup);
		}
	}

	/**
	 * returns the invalid FormControls only. Will not return invalid FormGroups or FormArrays
	 * @param formControl
	 */
	static getInvalidControls(formControl: AbstractControl): InvalidControlErrors[] {
		// tslint:disable-next-line:max-line-length
		// console.log(`getInvalidControls, ${FormBuilderService.getControlName(formControl)} - ${FormBuilderService.getControlType(formControl)}`);
		let invalidControls: InvalidControlErrors[] = [];
		if (formControl) {
			if ((formControl instanceof FormGroup || formControl instanceof FormArray) && formControl.invalid) {
				Object.keys(formControl.controls).forEach((key) => {
					const childCtrl = formControl.get(key);
					const grpInvalidControls = FormBuilderService.getInvalidControls(childCtrl);
					invalidControls = [...invalidControls, ...grpInvalidControls];
				});
			} else if (formControl.invalid) {
				invalidControls.push({
					fieldName: FormBuilderService.getControlName(formControl),
					control: formControl,
					errors: formControl.errors
				});
			}
		}
		return invalidControls;
	}

	/**
	 * Returns the dirty controls from a FormArray or FormGroup.
	 * We do not recurse down into the child FormGroups because sending a partial
	 * value to FireStore would clear any values NOT included in the payload
	 * @param formControl
	 */
	static getDirtyControls(formControl: AbstractControl): AbstractControl[] {
		let dirtyControls: AbstractControl[] = [];
		if (formControl) {
			if (formControl instanceof FormGroup && formControl.dirty) {
				dirtyControls = FormBuilderService.formGroupControlsToArray(formControl)
					.filter(ctrl => ctrl.dirty);
			}else if (formControl instanceof FormArray && formControl.dirty) {
				dirtyControls = formControl.controls
					.filter(ctrl => ctrl.dirty);
			}
		}
		return dirtyControls;
	}

	/**
	 * Get the name of an AbstractControl (i.e. FormGroup, FormArray, FormControl). If we've reached
	 * the top of the tree (meaning the very first form control) return 'TopControl'
	 * @param control
	 */
	static getControlName(control: AbstractControl): string {
		const parentControls = control.parent?.controls;
		if (parentControls) {
			return Object.keys(parentControls).find(name => control === parentControls[name]);
		} else {
			return 'TopControl';
		}
	}

	static getFullControlPath(control: AbstractControl): string {
		let pathItems: string[] = [FormBuilderService.getControlName(control)];
		let ancestorCtrl = control.parent;
		while (ancestorCtrl) {
			pathItems.push(FormBuilderService.getControlName(ancestorCtrl));
			ancestorCtrl = ancestorCtrl.parent;
		}
		pathItems = pathItems.reverse();
		if (pathItems[0] === 'TopControl') {
			pathItems.shift();
		}
		return pathItems.join('.');
	}

	/**
	 * Get the type of control
	 * @param control
	 */
	static getControlType(control: AbstractControl): FormControlType {
		if (control instanceof FormGroup) {
			return 'FormGroup';
		} else if (control instanceof FormArray) {
			return 'FormArray';
		} else {
			return 'FormControl';
		}
	}

	/**
	 * Validator to check if a date is before, after or equal
	 * @param checkDateStr
	 * @param condition
	 * @param canEqual
	 * @deprecated
	 */
	static dateIsBeforeAfterEqual(checkDateStr: string, condition: 'before' | 'after', canEqual: boolean): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const ctrlVal = control.value ? new Date(control.value) : null;
			let returnVal = null;
			if (ctrlVal && checkDateStr) {
				const checkDate = new Date(checkDateStr);
				if (condition === 'before') {
					if (DateFns.isBefore(ctrlVal, checkDate)) {
						returnVal = {is_before: true};
						control.setErrors(returnVal);
					}
				} else if (condition === 'after') {
					if (DateFns.isAfter(ctrlVal, checkDate)) {
						returnVal = {is_after: true};
						control.setErrors(returnVal);
					}
				}
				if (!canEqual) {
					if (DateFns.isEqual(ctrlVal, checkDate)) {
						returnVal = {is_equal: true};
						control.setErrors(returnVal);
					}
				}
			}
			return returnVal;
		};
	}

	/**
	 * Validator to check if a boolean array contains true. Example would be a group of checkboxes and the user must select at least one
	 */
	static booleanArrayContainsTrue(): ValidatorFn {
		return (control: FormArray): {[key: string]: any} | null => {
			let returnVal = null;
			if (control && !control.value.includes(true)) {
				returnVal = {nothing_checked: true};
				control.setErrors(returnVal);
			}
			return returnVal;
		};
	}

	/**
	 * Clones an abstract control and its validators.
	 * Credit: https://stackoverflow.com/questions/48308414/deep-copy-of-angular-reactive-form
	 * @param control
	 */
	static cloneAbstractControl<T extends AbstractControl>(control: T): T {
		let newControl: T;
		if (control instanceof FormGroup) {
			const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
			const controls = control.controls;
			Object.keys(controls).forEach(key => {
				formGroup.addControl(key, FormBuilderService.cloneAbstractControl(controls[key]));
			});
			newControl = formGroup as any;
		} else if (control instanceof FormArray) {
			const formArray = new FormArray([], control.validator, control.asyncValidator);
			control.controls.forEach(formControl => formArray.push(FormBuilderService.cloneAbstractControl(formControl)));
			newControl = formArray as any;
		} else if (control instanceof FormControl) {
			newControl = new FormControl(control.value, control.validator, control.asyncValidator) as any;
		} else {
			throw new Error('Error: unexpected control type');
		}
		if (control.disabled) {
			newControl.disable({emitEvent: false});
		}
		return newControl;
	}

	/**
	 * If using checkboxes for an array  of possible values, this will convert the possible
	 * values into a boolean array based on what the "checked" value of the checkbox should be
	 * @param booleanArrayDef
	 */
	static getBooleanArrayFromValues(booleanArrayDef: BooleanArrayDefinition): boolean[] {
		const {possibleValues, initialValue} = booleanArrayDef;
		const boolArr = [];
		if (possibleValues?.length) {
			possibleValues.forEach(possibleVal => {
				if (initialValue?.includes(possibleVal)) {
					boolArr.push(true);
				}else{
					boolArr.push(false);
				}
			});
		}
		return boolArr;
	}

	/**
	 * If using checkboxes for an array of possible values, this will take a boolean array and
	 * convert it to a string array from the possible values
	 * @param booleanArrayDef
	 */
	static getValuesFromBooleanArray(booleanArrayDef: BooleanArrayDefinition): string[] {
		const {possibleValues, booleanArray} = booleanArrayDef;
		const stringArr = [];
		if (booleanArray?.length) {
			booleanArray.forEach((bool, idx) => {
				if (bool === true) {
					stringArr.push(possibleValues[idx]);
				}
			});
		}
		return stringArr;
	}

	static updateAllControlsValidity(control: FormGroup | FormArray, emitEvent = true): void {
		const controls = control instanceof FormArray ? control.controls : FormBuilderService.formGroupControlsToArray(control);
		controls.forEach((ctrl) => {
			if (ctrl instanceof FormControl) {
				ctrl.updateValueAndValidity({emitEvent});
			}else {
				// @ts-ignore
				FormBuilderService.updateAllControlsValidity(ctrl, emitEvent);
			}
		});
	}
}
