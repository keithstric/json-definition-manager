import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
	UntypedFormBuilder,
	FormControlDirective,
	FormControlName,
	FormGroupDirective,
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import {LayoutModule} from '@layout/layout.module';
import {CollapseCardComponent} from '@shared/components/collapse-card/collapse-card.component';
import {SnackBarRef} from '@shared/components/snack-bar/snack-bar.ref';
import {UserAvatarComponent} from '@shared/components/user-avatar/user-avatar.component';
import {FileDnDDirective} from '@shared/directives/file-dn-d/file-dn-d.directive';
import {SafeHtmlPipe} from '@shared/pipes/safe-html.pipe';
import {FormHelperService} from '@shared/services/form-helper/form-helper.service';
import {AgGridModule} from 'ag-grid-angular';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { SnackBarComponent } from '@shared/components/snack-bar/snack-bar.component';
import { ViewRefDirective } from 'src/app/shared/directives/view-ref/view-ref.directive';
import { CheckboxStringValueDirective } from './directives/checkbox-string-value/checkbox-string-value.directive';

const sharedComponents = [
	CollapseCardComponent,
	ConfirmModalComponent,
	SnackBarComponent,
	UserAvatarComponent,
];

const sharedDirectives = [
	FileDnDDirective,
	ViewRefDirective
];

const sharedPipes = [
	SafeHtmlPipe
];

@NgModule({
    declarations: [
        ...sharedComponents,
        ...sharedDirectives,
        ...sharedPipes,
        CheckboxStringValueDirective
    ],
    imports: [
				AgGridModule,
        CommonModule,
        FormsModule,
				LayoutModule,
        ReactiveFormsModule
    ],
    providers: [
        SnackBarRef,
        UntypedFormBuilder,
        FormHelperService,
        FormGroupDirective,
        FormControlDirective,
        FormControlName
    ],
    exports: [
        ...sharedComponents,
        ...sharedPipes,
        FormsModule,
        ReactiveFormsModule,
    ]
})

export class SharedModule { }
