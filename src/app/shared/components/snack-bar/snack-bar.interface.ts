export enum SnackbarMessageTypes {
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error',
	SUCCESS = 'success',
	DANGER = 'danger',
	DEFAULT = 'default'
}

export interface SnackbarAction {
	label: string;
	actionHandler?: any;
}

export interface SnackbarConfig {
	/**
	 * Basically sets the color of the snackbar
	 */
	messageType?: SnackbarMessageTypes;
	message: string;
	/**
	 * The amount of time the snackbar will be visible in milliseconds
	 * if omitted will default to 5000
	 * if set to 0 will require the user to dismiss
	 */
	duration?: number;
	action?: SnackbarAction;
}
