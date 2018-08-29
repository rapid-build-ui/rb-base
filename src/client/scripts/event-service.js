/********************************************************************************
 * EVENT SERVICE
 ********************************************************************************
 * HOW TO USE
 - import EventService from './event-service.js';
 - this.rb.events = EventService.call(this); :object (set in constructor)
 * API
 - this.rb.events.events; :object (readonly: hashmap of events)
 - this.rb.events.add(elm, 'space separated events', callback[, options]); :void
 - this.rb.events.remove(elm, 'space separated events', callback); :void
 - this.rb.events.removeAll([options]); :void
 - this.rb.events.emit(elm, 'event' [, { detail: any } ]); :boolean
 ********************************************************************************/
import { emit } from '../../../skatejs/dist/esnext/emit.js';
import guid from './guid-service.js';

/* Event Helpers
 ****************/
const EventHelper = {
	_getLoc(target) { // :string
		if (target.getRootNode().host) return 'shadow';
		if (target.assignedSlot) return 'slot';
		return 'document';
	},
	_getSpace(target, space = null) { // :string
		if (target.dataset.rbEvent) return target.dataset.rbEvent;
		if (!space) space = guid.create(5);
		target.dataset.rbEvent = space;
		return space;
	},
	getEvents(evt) { // :string[]
		return evt.replace(/\s+/g,' ').split(' ');
	},
	getRbEvent(target) { // :object { loc: string, space: string }
		if (target === this)                 return { space: 'host',     loc: 'host' };
		if (target === document.defaultView) return { space: 'window',   loc: 'window' };
		if (target === document)             return { space: 'document', loc: 'document' };
		if (target === document.body)        return { space: 'body',     loc: 'document' };
		if (!Array.isArray(target)) // element
			return {
				space: EventHelper._getSpace.call(this, target),
				loc: EventHelper._getLoc.call(this, target)
			};
		const rbEvent = { loc: null, space: null };
		if (!target.length) return rbEvent;
		for (const elm of target) // elements
			rbEvent.space = EventHelper._getSpace.call(this, elm, rbEvent.space);
		rbEvent.loc = EventHelper._getLoc.call(this, target[0]);
		return rbEvent;
	},
	getTarget(target) { // :object[] | object | null (converts NodeList to Array)
		if (target instanceof NodeList) target = Array.from(target);
		if (Array.isArray(target) && !target.length) return null;
		return target;
	},
	handleEventListener(action, target, evt, callback) { // :void
		const { func, opts } = callback;
		action = action === 'add' ? 'addEventListener' : 'removeEventListener';
		if (!Array.isArray(target)) return target[action](evt, func, opts);
		if (!target.length) return;
		for (const elm of target) elm[action](evt, func, opts);
	},
	getRbEventElm(space, loc) { // :object[] | object (object = element)
		switch (space) {
			case 'host':     return this;
			case 'window':   return document.defaultView;
			case 'document': return document;
			case 'body':     return document.body;
			default:
				let elms;
				switch (loc) {
					case 'shadow':
						elms = this.shadowRoot.querySelectorAll(`[data-rb-event="${space}"]`);
						break;
					case 'slot':
						elms = this.querySelectorAll(`[data-rb-event="${space}"]`);
						break;
					case 'document':
						elms = document.querySelectorAll(`[data-rb-event="${space}"]`);
						break;
				}
				return EventHelper.getTarget.call(this, elms);
		}
	},
	getEventCallback(target, callback, bind) { // :function
		switch (true) {
			case bind === false || bind === null:
				return callback;
			case bind === void 0 && target === this:
				return callback;
			case bind instanceof Object:
				return callback.bind(bind);
			default:
				return callback.bind(this);
		}
	},
	getCallbackName(callback) { // :string
		if (typeof callback === 'object') // true when removeAll() is called
			return EventHelper.getCallbackName.call(this, callback.func);

		if (!callback.name) // for anonymous functions (set name for removeAll())
			Object.defineProperty(callback, 'name', { value: guid.create(5) });

		// bound functions are prefixed with 'bound '
		return callback.name.replace(/^bound /, '');
	}
};

/* Event Service
 ****************/
const EventService = function() { // :object (this = rb-component)
	/* Private
	 **********/
	let _events = {};

	/* Public
	 *********/
	return {
		get events() { // :object (readonly: hashmap of events)
			return _events;
		},
		add: (target, evt, callback, opts={}) => { // :void (space separated event names)
			target = EventHelper.getTarget.call(this, target);
			if (!target) return;
			const { loc, space } = EventHelper.getRbEvent.call(this, target);
			const events = EventHelper.getEvents.call(this, evt);
			const cbName = EventHelper.getCallbackName.call(this, callback);
			for (let evt of events) {
				if (!_events[space]) _events[space] = { loc, events: {} };
				if (!_events[space].events[evt]) _events[space].events[evt] = {};
				if (!_events[space].events[evt][cbName])
					_events[space].events[evt][cbName] = {
						func: EventHelper.getEventCallback.call(this, target, callback, opts.bind),
						opts
					}
				const cb = _events[space].events[evt][cbName];
				EventHelper.handleEventListener.call(this, 'add', target, evt, cb);
			}
		},
		remove: (target, evt, callback) => { // :void (space separated event names)
			target = EventHelper.getTarget.call(this, target);
			if (!target) return;
			const { space } = EventHelper.getRbEvent.call(this, target);
			const events = EventHelper.getEvents.call(this, evt);
			const cbName = EventHelper.getCallbackName.call(this, callback);
			for (let evt of events) {
				if (!_events[space]) return;
				if (!_events[space].events) return;
				if (!_events[space].events[evt]) return;
				if (!_events[space].events[evt][cbName]) return;
				const cb = _events[space].events[evt][cbName];
				delete _events[space].events[evt][cbName];
				if (!Object.keys(_events[space].events[evt]).length) delete _events[space].events[evt];
				if (!Object.keys(_events[space].events).length) delete _events[space];
				EventHelper.handleEventListener.call(this, 'remove', target, evt, cb);
			}
		},
		removeAll: (opts={}) => { // :void
			const events = this.rb.events.events;
			for (const [space, target] of Object.entries(events)) {
				const elm = EventHelper.getRbEventElm.call(this, space, target.loc);
				for (const [evt, cbs] of Object.entries(target.events)) {
					for (const cb of Object.values(cbs)) {
						this.rb.events.remove(elm, evt, cb);
					}
				}
			}
			if (!!opts.force) _events = {};
		},
		emit: (target, evt, opts={}) => { // :boolean
			return emit(target, evt, opts); // returns elm.dispatchEvent(e)
		}
	};
};

/* Export it!
 *************/
export default EventService;