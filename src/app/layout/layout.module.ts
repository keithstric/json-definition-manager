import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PageNotFoundComponent} from '@layout/components/page-not-found/page-not-found.component';
import {SiteFooterComponent} from '@layout/components/site-footer/site-footer.component';
import {SiteHeaderComponent} from '@layout/components/site-header/site-header.component';
import {LayoutService} from '@layout/services/layout/layout.service';
import {LoadingService} from '@layout/services/loading/loading.service';
import {SharedModule} from '@shared/shared.module';

const components = [
	PageNotFoundComponent,
	SiteFooterComponent,
	SiteHeaderComponent,
];

/**
 * The LayoutModule
 */
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedModule
    ],
    declarations: [
        ...components
    ],
    exports: [
        ...components
    ],
    providers: [
        LayoutService,
        LoadingService
    ]
})
export class LayoutModule { }
