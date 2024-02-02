import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-collapse-card',
  templateUrl: './collapse-card.component.html',
  styleUrls: ['./collapse-card.component.scss']
})
export class CollapseCardComponent {
	@Input() title: string = 'Change Me!';
	@Input() isCollapsed: boolean = true;

	/**
	 * Toggle collapse element open or closed
	 */
	toggleCollapse() {
		this.isCollapsed = !this.isCollapsed;
	}
}
