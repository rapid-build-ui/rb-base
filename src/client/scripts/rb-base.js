/**********************************
 * RB-BASE (for all rb-components)
 **********************************/
import { props, withComponent } from '../../../skatejs/dist/esnext/index.js';
import { html, render } from '../../../lit-html/lib/lit-extended.js';
import EventService from './event-service.js';
import GuidService from './guid-service.js';
import TypeService from './type-service.js';
import View from './view-service.js';

/* RB Base Class
 ****************/
const RbBase = (Base = HTMLElement) => class extends withComponent(Base) {
	/* Lifecycle
	 ************/
	constructor() { // :void
		super();
		this.rb = {
			events: EventService.call(this),
			guid:   GuidService,
			type:   TypeService,
			view:   View.call(this)
		}
	}
	disconnected() { // :void
		// console.log('base disconnected');
		this.rb.events.removeAll({ force: true });
		// console.log(this.rb.events.events);
	}

	/* @skatejs/renderer-lit-html
	 *****************************/
	async renderer(root, call) { // :void
		render(call(), root);
		await this.rb.view.readyCallback();
	}
}

/* Export it!
 *************/
export { html, props, RbBase }