import {
	Component,
	ComponentFactoryResolver, ElementRef,
	Injector,
	OnInit,
	TemplateRef,
	Type,
	ViewChild
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ViewRefDirective} from '@shared/directives/view-ref/view-ref.directive';
import {BsModalRef, ModalOptions} from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-confirm-modal',
	templateUrl: './confirm-modal.component.html',
	styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
	modalHeaderText: string;
	modalTitle: string;
	modalTitleHtml: string;
	modalSubHeading: string;
	modalSubHeadingHtml: string;
	modalHtmlContent: string;
	modalTextContent: string;
	modalTemplateContent: TemplateRef<any>;
	modalComponentContent: Type<any>;
	modalComponentContentInitialState: any;
	modalComponentContentInstance: any;
	hideCloseButton: boolean = false;
	hideCancelButton: boolean = false;
	hideConfirmButton: boolean = false;
	cancelButtonLabel: string = 'cancel';
	confirmButtonLabel: string = 'ok';
	confirmButtonDisabled: boolean = false;
	confirmHandler: any;
	cancelHandler: any;
	data: any;
	formGroup: FormGroup;
	ngModalOptions: ModalOptions;
	componentInjector: Injector;
	closeOnConfirm: boolean = true;
	closeOnCancel: boolean = true;
	closeHandler: any;
	disableCloseButton: boolean = false;
	hideFooter: boolean = false;

	@ViewChild(ViewRefDirective, {static: true}) componentViewRef: ViewRefDirective;

	constructor(
		public bsModalRef: BsModalRef,
		private _componentFactoryResolver: ComponentFactoryResolver
	) {}

	ngOnInit() {
		if (this.modalComponentContent) {
			this.createContentComponent();
		}
	}

	/**
	 * Create an instance of the modalComponentContent component, insert it
	 * into the DOM and set any properties defined in modalComponentContentInitialState
	 */
	createContentComponent() {
		const compFactory = this._componentFactoryResolver.resolveComponentFactory(this.modalComponentContent);
		this.componentViewRef.viewContainerRef.clear();
		const componentRef = this.componentViewRef.viewContainerRef.createComponent(compFactory);
		this.modalComponentContentInstance = componentRef.instance;
		if (this.modalComponentContentInitialState) {
			Object.keys(this.modalComponentContentInitialState).forEach((key) => {
				this.modalComponentContentInstance[key] = this.modalComponentContentInitialState[key];
			});
		}
	}

	/**
	 * handler when the close button is clicked
	 */
	onClose() {
		if (this.disableCloseButton) {
			return;
		} else if (this.closeHandler) {
			this.closeHandler();
		}
		this.bsModalRef.hide();
	}

	/**
	 * Handler when the cancel button is clicked
	 */
	onCancel() {
		if (this.cancelHandler) {
			this.cancelHandler();
		}
		if (this.closeOnCancel) {
			this.bsModalRef.hide();
		}
	}

	/**
	 * Handler when the confirm button is clicked
	 */
	onConfirm() {
		if (this.confirmHandler) {
			this.confirmHandler(this.data);
		} else {
			console.warn('No confirmHandler for the ConfirmModalComponent');
		}
		if (this.closeOnConfirm) {
			this.bsModalRef.hide();
		}
	}
}
