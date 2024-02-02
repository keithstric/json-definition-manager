import {Injectable} from '@angular/core';
import {ServiceLocator} from '@core/services/service-locator';
import {ConfirmModalComponent} from '@shared/components/confirm-modal/confirm-modal.component';
import {SnackbarConfig} from '@shared/components/snack-bar/snack-bar.interface';
import {SnackBarRef} from '@shared/components/snack-bar/snack-bar.ref';
import { ConfirmModalConfig } from '@shared/components/confirm-modal/confirm-modal.interface';
import {BsModalService, ModalOptions} from 'ngx-bootstrap/modal';

/**
 * This service should only contain static methods for showing notifications to the user
 */
@Injectable()
export class NotificationService {

	constructor() {}

	/**
	 * Show a snackbar/toast message
	 * @param config
	 */
	static showSnackbar(config: SnackbarConfig) {
		const snackbarRef = ServiceLocator.injector.get(SnackBarRef);
		snackbarRef.show(config);
	}

	/**
	 * Show a confirmation dialog
	 *
	 * @example
	 * import {ViewChild} from '@angular/core';
	 * import {ConfirmModalConfig} from 'gis-ui/src/app/shared/components/confirm-modal/confirm-modal.interface';
	 *
	 * const confirmHandler = (data: any) => {
	 * 	console.log('A custom confirmation handler', data);
	 * };
	 * const textModalConfig: ConfirmModalConfig = {
	 * 	modalTitle: 'A Custom Modal',
	 * 	modalTextContent: 'This will be the content of the modal dialog',
	 * 	data: 'foo', // can be anything
	 * 	confirmButtonLabel: 'Send it!',
	 * 	confirmHandler: confirmHandler.bind(this)
	 * };
	 * NotificationService.showConfirmDialog(textModalConfig);
	 *
	 * @param modalConfig
	 */
	static showConfirmDialog(modalConfig: ConfirmModalConfig) {
		// because this is a static method, cannot inject BsModalService into constructor and use that, need to locate it
		const bsModalService = ServiceLocator.injector.get(BsModalService);
		const modalConfigImpl: ModalOptions<ConfirmModalConfig> = {
			...modalConfig.ngModalOptions,
			initialState: modalConfig,
		};
		return bsModalService.show(ConfirmModalComponent, modalConfigImpl);
	}
}
