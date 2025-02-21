import { stg } from './Utils';

export default class Pic {

	static url(pic, thumb = false) {
		if (pic && stg) {
			return stg.url_api + '/uploads' + (thumb ? '/_' : '') + pic;
		} else {
			return '';
		}
	}

}