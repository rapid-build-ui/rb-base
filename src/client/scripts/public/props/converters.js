/*************************************************************
 * PROPERTY CONVERTERS
 * ----------------------------------------------------------
 * HOW TO USE
 - import Converter from './converters.js'; :object
 * API
 - All methods convert the attr val to a type and returns it.
 - The first param is the attr val which is always a string.
 *************************************************************/
import Type from '../services/type.js';

const Converters = {
	boolean(val) { // :boolean
		if (!Type.is.string(val)) return val;
		return /^true$/i.test(val);
	},
	valueless(val) { // :boolean
		if (!Type.is.string(val)) return val;
		val = val.trim();
		if (!val) return true; // valueless attr is empty string
		return /^true$/i.test(val);
	}
};

/* Export it!
 *************/
export default Converters;