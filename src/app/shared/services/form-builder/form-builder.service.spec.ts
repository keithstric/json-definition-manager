import {Injector} from '@angular/core';
import {inject, TestBed} from '@angular/core/testing';
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ServiceLocator} from '@core/services/service-locator';

import {BooleanArrayDefinition, FormBuilderService} from 'src/app/shared/services/form-builder/form-builder.service';

describe('FormBuilderService', () => {
	let service: FormBuilderService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				FormsModule,
				ReactiveFormsModule
			],
			providers: [
				FormBuilder
			]
		});
	});

	beforeEach(inject([Injector], (injector) => {
		ServiceLocator.injector = injector;
		service = TestBed.inject(FormBuilderService);
	}));

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should convert an object to a FormGroup', () => {
		const obj = {
			firstName: 'Iron',
			lastName: 'Man',
			emailAddress: 'i.am.iron.man@avengers.net',
			powers: [{name: 'armor'}]
		};
		const fg = FormBuilderService.convertObjToFormGroup(obj);
		expect(Object.keys(fg.controls).length).toEqual(4);
		expect((fg.get('powers') as FormArray).length).toEqual(1);
	});

	it('should convert an array into a FormArray', () => {
		const arr = [{name: 'armor'}];
		const fa = FormBuilderService.convertArrayToFormArray(arr);
		expect(fa.length).toEqual(1);
	});

	it('should get invalid control errors', () => {
		const obj = {
			firstName: '',
			lastName: 'Man',
			emailAddress: 'i.am.iron.man@avengers.net',
			powers: [{name: 'armor'}]
		};
		const fg = FormBuilderService.convertObjToFormGroup(obj);
		fg.get('firstName').setValidators(Validators.required);
		fg.get('firstName').updateValueAndValidity();
		const invalidCtrls = FormBuilderService.getInvalidControls(fg);
		expect(invalidCtrls.length).toEqual(1);
		expect(invalidCtrls[0].fieldName).toEqual('firstName');
		expect(invalidCtrls[0].errors.required).toBeTrue();
	});

	it('should get invalid controls', () => {
		const obj = {
			firstName: '',
			lastName: 'Man',
			emailAddress: 'i.am.iron.man@avengers.net',
			powers: [{name: 'armor'}]
		};
		const fg = FormBuilderService.convertObjToFormGroup(obj);
		fg.get('firstName').setValidators(Validators.required);
		fg.get('firstName').updateValueAndValidity();
		const invalidCtrls = FormBuilderService.getInvalidControls(fg);
		expect(invalidCtrls.length).toEqual(1);
		expect(invalidCtrls[0].fieldName).toEqual('firstName');
	});

	it('should get a control\'s field name', () => {
		const obj = {
			firstName: 'Iron',
			lastName: 'Man',
			emailAddress: 'i.am.iron.man@avengers.net',
			powers: [{name: 'armor'}]
		};
		const fg = FormBuilderService.convertObjToFormGroup(obj);
		const fieldName = FormBuilderService.getControlName(fg.get('firstName'));
		expect(fieldName).toEqual('firstName');
	});

	it('should clone a control', () => {
		const obj = {
			firstName: 'Iron',
			lastName: 'Man',
			emailAddress: 'i.am.iron.man@avengers.net',
			powers: [{name: 'armor'}]
		};
		const fg = FormBuilderService.convertObjToFormGroup(obj);
		const cloneFg = FormBuilderService.cloneAbstractControl(fg);
		const clonePowers = FormBuilderService.cloneAbstractControl(fg.get('powers'));
		const cloneCtrl = FormBuilderService.cloneAbstractControl(fg.get('firstName'));
		expect(cloneFg).toBeTruthy();
		expect(clonePowers).toBeTruthy();
		expect(cloneCtrl).toBeTruthy();
	});

	it('should get the control type', () => {
		const obj = {
			firstName: 'Iron',
			lastName: 'Man',
			emailAddress: 'i.am.iron.man@avengers.net',
			powers: [{name: 'armor'}]
		};
		const fg = FormBuilderService.convertObjToFormGroup(obj);
		const formGroup = FormBuilderService.getControlType(fg);
		const formArr = FormBuilderService.getControlType(fg.get('powers'));
		const formCtrl = FormBuilderService.getControlType(fg.get('firstName'));
		expect(formGroup).toEqual('FormGroup');
		expect(formArr).toEqual('FormArray');
		expect(formCtrl).toEqual('FormControl');
	});

	it('should return a control\'s controls as an array', () => {
		const obj = {
			firstName: 'Iron',
			lastName: 'Man',
			emailAddress: 'i.am.iron.man@avengers.net',
			powers: [{name: 'armor'}]
		};
		const fg = FormBuilderService.convertObjToFormGroup(obj);
		const fgArr = FormBuilderService.formGroupControlsToArray(fg);
		expect(Array.isArray(fgArr)).toBeTrue();
		expect(fgArr.length).toEqual(4);
	});

	it('should convert possible values to a boolean array', () => {
		const boolArrDef: BooleanArrayDefinition = {
			possibleValues: ['AUDIO', 'VIDEO', 'IN-PERSON']
		};
		const defaultBoolArr = FormBuilderService.getBooleanArrayFromValues(boolArrDef);
		expect(defaultBoolArr.length).toEqual(3);
		expect(defaultBoolArr.includes(true)).toBeFalse();

		boolArrDef.initialValue = ['AUDIO'];
		const otherBoolArr = FormBuilderService.getBooleanArrayFromValues(boolArrDef);
		expect(otherBoolArr.length).toEqual(3);
		expect(otherBoolArr[0]).toBeTrue();
	});

	it('should convert a boolean array to a value array', () => {
		const boolArrDef: BooleanArrayDefinition = {
			possibleValues: ['AUDIO', 'VIDEO', 'IN-PERSON'],
			booleanArray: [true, false, false]
		};
		const audioOnly = FormBuilderService.getValuesFromBooleanArray(boolArrDef);
		expect(audioOnly.length).toEqual(1);
		expect(audioOnly[0]).toEqual(boolArrDef.possibleValues[0]);

		boolArrDef.booleanArray = [false, true, true];
		const noAudio = FormBuilderService.getValuesFromBooleanArray(boolArrDef);
		expect(noAudio.length).toEqual(2);
		expect(noAudio.includes('AUDIO')).toBeFalse();
	});

	it('should get the full path of a control', () => {
		const nestedFg = FormBuilderService.convertObjToFormGroup({
			foo: {
				bar: {
					baz: [
						{boom: 'bam', bada: 'bing'},
						{boom: 'bam', bada: 'bing'}
					]
				}
			}
		});
		const fgPath = 'foo.bar';
		const fgCtrl = nestedFg.get(fgPath);
		const fullFgPath = FormBuilderService.getFullControlPath(fgCtrl);
		expect(fullFgPath).toEqual(fgPath);
		const faPath = 'foo.bar.baz';
		const faCtrl = nestedFg.get(faPath);
		const fullFaPath = FormBuilderService.getFullControlPath(faCtrl);
		expect(fullFaPath).toEqual(faPath);
		const faItemPath = 'foo.bar.baz.0';
		const faItemCtrl = nestedFg.get(faItemPath);
		const fullFaItemPath = FormBuilderService.getFullControlPath(faItemCtrl);
		expect(fullFaItemPath).toEqual(faItemPath);
		const ctrlPath = 'foo.bar.baz.1.bada';
		const checkCtrl = nestedFg.get(ctrlPath);
		const fullCtrlPath = FormBuilderService.getFullControlPath(checkCtrl);
		expect(fullCtrlPath).toEqual(ctrlPath);
	});

});
