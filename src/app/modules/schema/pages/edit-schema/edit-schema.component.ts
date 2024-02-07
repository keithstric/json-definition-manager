import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '@core/services/firestore/firestore.service';
import {NotificationService} from '@core/services/notification/notification.service';
import {DefinitionDataTypes, DefinitionItem} from '@modules/schema/interfaces/schema.interface';
import {SnackbarMessageTypes} from '@shared/components/snack-bar/snack-bar.interface';
import {ISchema} from '@shared/interfaces/map.interface';
import {Subject, Subscription} from 'rxjs';
import * as _ from 'lodash';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-edit-schema',
  templateUrl: './edit-schema.component.html',
  styleUrls: ['./edit-schema.component.scss']
})
export class EditSchemaComponent implements OnInit, OnDestroy {
	schemaDoc: ISchema;
	schemaName: string;
	schemaDesc: string;
	schema: any;
	currentSchema: any;
	definition: DefinitionItem[] = [{path: null, description: null, type: null, schema: null, required: false, comments: null}];
	currentDefinition: DefinitionItem[] = [];
	docId: string;
	subscriptions: Subscription = new Subscription();
	routeSub: Subscription;

	constructor(
		private _route: ActivatedRoute,
		private firestore: FirestoreService,
	) {}

	async ngOnInit() {
		this.routeSub = this.subscriptions.add(
			this._route.params.subscribe(async (params) => {
				this.docId = params.schemaId;
				this.schemaDoc = await this.firestore.getDocumentById<ISchema>('schemas', this.docId);
				if (this.schemaDoc) {
					this.schema = Object.assign(this.schemaDoc.schema, {});
					this.currentSchema = Object.assign(this.schemaDoc.schema, {});
					this.schemaName = this.schemaDoc.name;
					this.schemaDesc = this.schemaDoc.description;
					this.definition = Array.from(this.schemaDoc.definition);
					this.currentDefinition = Array.from(this.schemaDoc.definition);
				}
			})
		);
	}

	ngOnDestroy() {
		this.subscriptions?.unsubscribe();
	}

	/**
	 * Save the current schema
	 */
	async saveSchema() {
		const workingDoc = this.docId !== 'new'
			? {...this.schemaDoc, schema: this.currentSchema, definition: this.currentDefinition}
			: {
				name: this.schemaName,
				description: this.schemaDesc,
				schema: this.currentSchema,
				definition: this.currentDefinition,
			};
		try {
			const resultDoc = this.docId === 'new'
				? await this.firestore.addDocument('schemas', workingDoc)
				: await this.firestore.updateDocument('schemas', this.docId, workingDoc);
			NotificationService.showSnackbar({
				message: `Successfully ${this.docId === 'new' ? 'created' : 'updated'} the ${resultDoc.name} schema.`,
				messageType: SnackbarMessageTypes.SUCCESS
			});
		}catch (e) {
			throw e;
		}
	}

	/**
	 * Set the editor value to the initial value
	 */
	revertChanges() {
		this.currentSchema = Object.assign({}, this.schema);
		this.currentDefinition = Array.from(this.definition);
	}

	onDataChange(evt) {
		console.log('onDataChange', evt);
		this.currentSchema = evt.schema;
		this.currentDefinition = evt.definition;
		console.log('this.schema=', this.schema);
		console.log('this.currentSchema=', this.currentSchema);
		console.log('this.definition=', this.definition);
		console.log('this.currentDefinition=', this.currentDefinition);
	}
}
