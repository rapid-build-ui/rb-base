/***********************************************************
 * GUID SERVICE
 ***********************************************************
 * HOW TO USE
 - import GuidService from './guid-service.js';
 - this.rb.guid = GuidService; :object (set in constructor)
 * API
 - this.rb.guid.create(maxLength = 12); :string
 ***********************************************************/
const GuidService = {
	create(maxLength = 12) { // :string (sometimes returns maxLength - 1 chars)
		return Math.round((Math.random() * 36 ** maxLength)).toString(36);
	}
};

/* Export it!
 *************/
export default GuidService;