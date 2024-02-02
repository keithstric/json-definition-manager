import {Component, Injector, Input, OnInit, TemplateRef, Type, ViewChild} from '@angular/core';
import {ComponentFixture, inject, TestBed, waitForAsync} from '@angular/core/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ServiceLocator} from '@core/services/service-locator';
import {SafeHtmlPipe} from '@shared/pipes/safe-html.pipe';
import {FormBuilderService} from '@shared/services/form-builder/form-builder.service';
import {ModalTestingModule} from '@testing/modules/modal-testing.module';
import {Mock} from 'protractor/built/driverProviders';

import {ConfirmModalComponent} from './confirm-modal.component';

@Component({
	selector: 'app-mock-component',
	template: `<div class="component-content">The component dom {{testProp}}</div>`
})
class MockComponent {
	@Input() testProp: string = 'default';
}

@Component({
	template: `
		<ng-template #div1><div class="template-content">Something inside a template here</div></ng-template>
	`,
})
class RefComponent {
	@ViewChild('div1', {static: true}) public template: TemplateRef<any>;
}

describe('ConfirmModalComponent', () => {
	let component: ConfirmModalComponent;
	let fixture: ComponentFixture<ConfirmModalComponent>;
	let refFixture: ComponentFixture<RefComponent>;
	let refComponent: RefComponent;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				ModalTestingModule,
				FormsModule,
				ReactiveFormsModule
			],
			declarations: [
				ConfirmModalComponent,
				RefComponent,
				MockComponent,
				SafeHtmlPipe
			],
			providers: [
				FormBuilder
			]
		})
			.compileComponents();
	}));

	beforeEach(inject([Injector], (injector: Injector) => {
		ServiceLocator.injector = injector;
		fixture = TestBed.createComponent(ConfirmModalComponent);
		refFixture = TestBed.createComponent(RefComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		refComponent = refFixture.componentInstance;
		refFixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should attempt to hide the modal when cancelled', () => {
		const hideSpy = spyOn(component.bsModalRef, 'hide');
		component.onCancel();
		expect(hideSpy).toHaveBeenCalled();
	});

	it('should not attempt to hide the modal when closeOnCancel is false', () => {
		component.cancelHandler = (data: any) => {console.log('cancel handler'); };
		component.closeOnCancel = false;
		fixture.detectChanges();
		const hideSpy = spyOn(component.bsModalRef, 'hide');
		component.onCancel();
		expect(hideSpy).not.toHaveBeenCalled();
	});

	it('should attempt to hide the modal when confirmed', () => {
		const hideSpy = spyOn(component.bsModalRef, 'hide');
		component.onConfirm();
		expect(hideSpy).toHaveBeenCalled();
	});

	it('should not attempt to hide the modal when closeOnConfirm is false', () => {
		component.confirmHandler = (data: any) => {console.log('confirm handler'); };
		component.closeOnConfirm = false;
		component.data = {foo: 'bar'};
		fixture.detectChanges();
		const hideSpy = spyOn(component.bsModalRef, 'hide');
		component.onConfirm();
		expect(hideSpy).not.toHaveBeenCalled();
	});

	it('should run the confirm handler', () => {
		component.confirmHandler = (data: any) => {console.log('confirm handler'); };
		component.data = {foo: 'bar'};
		fixture.detectChanges();
		const confirmSpy = spyOn(component, 'confirmHandler');
		component.onConfirm();
		expect(confirmSpy).toHaveBeenCalledWith(component.data);
	});

	it('should run the cancel handler', () => {
		component.cancelHandler = () => {console.log('cancel handler'); };
		fixture.detectChanges();
		const cancelSpy = spyOn(component, 'cancelHandler');
		component.onCancel();
		expect(cancelSpy).toHaveBeenCalled();
	});

	it('should display the modalHeaderText', () => {
		component.modalHeaderText = 'confirm something';
		fixture.detectChanges();
		const headerTextElem = fixture.nativeElement.querySelector('.modal-header-text');
		expect(headerTextElem.innerText.trim()).toEqual(component.modalHeaderText);
	});

	it('should display the modal title', () => {
		component.modalTitle = 'confirm title';
		fixture.detectChanges();
		const titleTextElem = fixture.nativeElement.querySelector('.modalTitle');
		expect(titleTextElem.innerText).toEqual(component.modalTitle);

		component.modalTitle = undefined;
		component.modalTitleHtml = `<h2>modal title</h2>`;
		fixture.detectChanges();
		const titleHtmlElem = fixture.nativeElement.querySelector('.modalTitle');
		expect(titleHtmlElem.innerHTML).toEqual(component.modalTitleHtml);
	});

	it('should display the subHeading', () => {
		component.modalSubHeading = 'sub heading';
		fixture.detectChanges();
		const textSubHeadingElem = fixture.nativeElement.querySelector('.modalSubHeading');
		expect(textSubHeadingElem.innerText).toEqual(component.modalSubHeading);

		component.modalSubHeading = undefined;
		component.modalSubHeadingHtml = `<p>a sub heading</p>`;
		fixture.detectChanges();
		const htmlSubHeadingElem = fixture.nativeElement.querySelector('.modalSubHeading');
		expect(htmlSubHeadingElem.innerHTML).toEqual(component.modalSubHeadingHtml);
	});

	it('should display the content', () => {
		component.modalTextContent = 'text content';
		fixture.detectChanges();
		const textContentElem = fixture.nativeElement.querySelector('.content-container');
		expect(textContentElem.innerText).toEqual(component.modalTextContent);

		component.modalTextContent = undefined;
		component.modalHtmlContent = `<p>modal html content</p>`;
		fixture.detectChanges();
		const htmlContentElem = fixture.nativeElement.querySelector('.content-container');
		expect(htmlContentElem.innerHTML).toEqual(component.modalHtmlContent);
	});

	it('should hide the confirm and cancel buttons', () => {
		component.hideConfirmButton = true;
		component.hideCancelButton = true;
		fixture.detectChanges();
		const hiddenButtons = fixture.nativeElement.querySelectorAll('.modal-footer button');
		expect(hiddenButtons.length).toEqual(0);

		component.hideConfirmButton = false;
		component.hideCancelButton = false;
		fixture.detectChanges();
		const buttons = fixture.nativeElement.querySelectorAll('.modal-footer button');
		expect(buttons.length).toEqual(2);
	});

	it('should show the proper button labels', () => {
		component.confirmButtonLabel = 'confirm button';
		component.cancelButtonLabel = 'cancel button';
		fixture.detectChanges();
		const cancelButton = fixture.nativeElement.querySelector('.modal-footer .btn-outline-primary');
		const confirmButton = fixture.nativeElement.querySelector('.modal-footer .btn-primary');
		expect(cancelButton.innerText.trim()).toEqual(component.cancelButtonLabel);
		expect(confirmButton.innerText.trim()).toEqual(component.confirmButtonLabel);
	});

	it('should disable the confirm button if form is invalid', () => {
		const formGroupObj = {name: ''};
		const formGroup = FormBuilderService.convertObjToFormGroup(formGroupObj);
		formGroup.get('name').setValidators([Validators.required]);
		formGroup.get('name').updateValueAndValidity();
		component.formGroup = formGroup;
		fixture.detectChanges();
		const confirmButton = fixture.nativeElement.querySelector('.modal-footer .btn-primary');
		expect(confirmButton.disabled).toBe(true);
	});

	it('should attempt to hide the modal when close button is clicked', () => {
		const hideSpy = spyOn(component.bsModalRef, 'hide');
		const closeButton = fixture.nativeElement.querySelector('.modal-header button');
		closeButton.click();
		expect(hideSpy).toHaveBeenCalled();
	});

	it('should show the template in modalTemplateContent', () => {
		component.modalTemplateContent = refComponent.template;
		fixture.detectChanges();
		const contentElem = fixture.nativeElement.querySelector('.template-content');
		expect(contentElem).toBeTruthy();
	});

});
