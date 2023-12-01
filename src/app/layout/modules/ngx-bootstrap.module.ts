import {NgModule} from '@angular/core';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {BsDropdownDirective, BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PopoverModule} from 'ngx-bootstrap/popover';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';
import {RatingModule} from 'ngx-bootstrap/rating';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';

@NgModule({
	declarations: [],
	imports: [
		BsDatepickerModule.forRoot(),
		BsDropdownModule.forRoot(),
		CollapseModule.forRoot(),
		ModalModule.forRoot(),
		PopoverModule.forRoot(),
		ProgressbarModule.forRoot(),
		RatingModule.forRoot(),
		TabsModule.forRoot(),
		TimepickerModule.forRoot(),
		TooltipModule.forRoot(),
		TypeaheadModule.forRoot()
	],
	exports: [
		BsDatepickerModule,
		BsDropdownModule,
		CollapseModule,
		ModalModule,
		PopoverModule,
		ProgressbarModule,
		RatingModule,
		TabsModule,
		TimepickerModule,
		TooltipModule,
		TypeaheadModule
	],
	providers: [
		BsDropdownDirective
	]
})
export class NgxBootstrapModule {}
