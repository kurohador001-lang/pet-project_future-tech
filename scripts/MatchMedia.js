import pxToRem from '../utils/pxToRem.js';

const MatchMedia = {
	mobileS: window.matchMedia(`(width <= ${pxToRem(480.98)}rem)`)
}

export default MatchMedia