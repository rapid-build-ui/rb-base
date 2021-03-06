/********************************
 * TYPE SERVICE
 * -----------------------------
 * HOW TO USE
 - import Type from './type.js';
 - Type = TypeService; :object
 ********************************/
const TypeService = {
	/* Return Type as String
	 ************************/
	get(v) { // :string
		for (const key in this.is) {
			if (!this.is.hasOwnProperty(key)) continue;
			if (key === 'stringArray') continue; // TODO
			if (this.is[key](v)) return key;
		}
	},
	/* All Return Boolean
	 *********************/
	is: {
		array(v) {
			return Array.isArray(v);
		},
		boolean(v) {
			return typeof v === 'boolean';
		},
		function(v) {
			return typeof v === 'function';
		},
		int(v) {
			return Number.isInteger(v);
		},
		null(v) {
			return v === null;
		},
		number(v) {
			if (this.null(v)) return false;
			if (this.array(v)) return false;
			if (this.string(v)) return false;
			if (this.boolean(v)) return false;
			return !isNaN(v);
		},
		object(v) {
			if (typeof v !== 'object') return false;
			if (v === null) return false;
			if (this.array(v)) return false;
			return true;
		},
		promise(v) {
			if (!this.object(v)) return false;
			return !!v.then;
		},
		string(v) {
			return typeof v === 'string';
		},
		stringArray(v) {
			if (!this.array(v)) return false;
			if (!v.length) return false;
			for (const val of v) {
				if (!this.string(val)) return false;
			}
			return true;
		},
		undefined(v) {
			return v === void 0;
		}
	}
}

/* Export it!
 *************/
export default TypeService;