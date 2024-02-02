import {TemplateRef, Type} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ModalOptions} from 'ngx-bootstrap/modal';

/**
 * This interface defines the configuration item for a confirm-modal modal dialog.
 * The confirm-modal component used in combination with NotificationService.showConfirmDialog(...)
 *  will display a ngx-bootstrap modal
 *
 * @example
 * import {ViewChild} from '@angular/core';
 * import {ConfirmModalConfig} from 'gis-ui/src/app/shared/components/confirm-modal/confirm-modal.interface';
 *
 * const confirmHandler = (data: any) => {
 * 	console.log('A custom confirmation handler', data);
 * }
 * // Just display text
 * const textModalConfig: ConfirmModalConfig = {
 * 	modalTitle: 'A Custom Modal',
 * 	modalTextContent: 'This will be the content of the modal dialog',
 * 	data: 'foo', // can be anything
 * 	confirmButtonLabel: 'Send it!',
 * 	confirmHandler: confirmHandler.bind(this),
 * 	cancelHandler: () => {
 * 		console.log('cancel clicked');
 * 	}
 * }
 * NotificationService.showConfirmDialog(textModalConfig);
 *
 * // Display a template
 * @ViewChild('modalTemplate', {static: true}) modalTemplate: TemplateRef<any>;
 * const templateModalConfig: ConfirmModalConfig = {
 * 	modalTitleHtml: '<h2>A Custom Modal</h2>',
 * 	modalTemplateContent: modalTemplate,
 * 	data: 'foo',
 * 	confirmButtonLabel: 'Send it!',
 * 	hideCancelButton: true,
 * 	confirmHandler: confirmHandler.bind(this)
 * };
 * NotificationService.showConfirmDialog(templateModalConfig);
 *
 * // Include a FormGroup when it has a status of "INVALID" will disable the confirm button
 * @ViewChild('formModalTemplate', {static: true}) formModalTemplate: TemplateRef<any>;
 * const formModalConfig: ConfirmModalConfig = {
 * 	modalTitleHtml: '<h2>A Custom Modal</h2>',
 * 	modalTemplateContent: formModalTemplate,
 * 	data: 'foo',
 * 	confirmButtonLabel: 'Send it!',
 * 	hideCancelButton: true,
 * 	formGroup: this.formGroup,
 * 	confirmHandler: confirmHandler.bind(this)
 * };
 * NotificationService.showConfirmDialog(templateModalConfig);
 *
 * // Display a component
 * const bar = {baz: 'boom'};
 * const componentModalConfig: ConfirmModalConfig = {
 * 	modalComponentContent: SomeComponent,
 * 	modalComponentContentInitialState: {
 * 		someProp: 'foo',
 * 		someOtherProp: bar
 * 	},
 * 	data: bar,
 * 	confirmHandler: confirmHandler.bind(this)
 * };
 * 	const modalRef = NotificationService.showConfirmDialog(componentModalConfig);
 * 	const componentInstance: SomeComponent = modalRef.content.modalComponentContentInstance;
 * 	// Listen to an event on SomeComponent
 * 	componentInstance.someEvent.subscribe((evt) => {});
 */
export interface ConfirmModalConfig {
	/**
	 * The text which will show in the modal-header
	 */
	modalHeaderText?: string;
	/**
	 * The title text of the modal
	 */
	modalTitle?: string;
	/**
	 * The title html of the modal (inside the h2 block)
	 */
	modalTitleHtml?: string;
	/**
	 * The Subheading text for the modal
	 */
	modalSubHeading?: string;
	/**
	 * the Subheading html for the modal (inside the h6 block)
	 */
	modalSubHeadingHtml?: string;
	/**
	 * HTML content to display in the body
	 */
	modalHtmlContent?: string;
	/**
	 * Text content to display in the body
	 */
	modalTextContent?: string;
	/**
	 * An ng-template to display in the body
	 */
	modalTemplateContent?: TemplateRef<any>;
	/**
	 * A component to display in the body
	 */
	modalComponentContent?: Type<any>;
	/**
	 * The initial state of the modalComponentContent component
	 */
	modalComponentContentInitialState?: any;
	/**
	 * True to hide the cancel button
	 */
	hideCancelButton?: boolean;
	/**
	 * True to hide the close button at the top (the X)
	 */
	hideCloseButton?: boolean;
	/**
	 * True to hide the confirm button
	 */
	hideConfirmButton?: boolean;
	/**
	 * The label for the cancel button
	 */
	cancelButtonLabel?: string;
	/**
	 * The label for the confirm button
	 */
	confirmButtonLabel?: string;
	/**
	 * True if the confirm button should be disabled
	 */
	confirmButtonDisabled?: boolean;
	/**
	 * any data item that may need to be returned
	 */
	data?: any;
	/**
	 * Provide a FormGroup to provide ability to disable the confirm button
	 */
	formGroup?: FormGroup;
	/**
	 * The ngx-bootstrap ModalOptions. Set options on the modal.
	 * Optional modal sizes can be found here {@link https://getbootstrap.com/docs/5.1/components/modal/#optional-sizes}
	 * ngx-bootstrap ModalOptions can be found here {@link https://valor-software.com/ngx-bootstrap/#/modals#modal-options}
	 */
	ngModalOptions?: ModalOptions;
	/**
	 * true to close after confirm handler has been run. Default true
	 */
	closeOnConfirm?: boolean;
	/**
	 * true to close after cancel handler has been run. Default true
	 */
	closeOnCancel?: boolean;
	/**
	 * Handler function to run when the cancel button is clicked
	 */
	cancelHandler?(): void;
	/**
	 * Handler function to run when the confirm button is clicked
	 */
	confirmHandler?(data?: any): void;
	/**
	 * handler function to run when the modal's close button is clicked
	 */
	closeHandler?(): void;
	/**
	 * If true, clicking the X won't close the modal.
	 */
	disableCloseButton?: boolean;
	/**
	 * If true, doesn't render the modal footer.
	 */
	hideFooter?: boolean;
}
