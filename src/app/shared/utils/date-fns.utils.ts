import {
	isDate,
	toDate,
	setMinutes,
	setHours,
	setDay,
	isEqual,
	isAfter,
	isBefore,
	add,
	isValid,
	isFuture,
	getSeconds,
	getMinutes,
	getHours,
	set,
	formatISO,
	parseISO,
	format,
	fromUnixTime,
	getUnixTime,
	intervalToDuration,
	formatDistanceToNow,
	setMilliseconds,
	isSameDay,
	addDays,
	addHours
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

/**
 * This class is meant to be a wrapper around date-fns and only import and
 * return the functions that we actually use. We do this to control the size of the bundles and
 * prevent multiple imports of the same functions or the entire date-fns library.
 * This is an alternative to moment.js
 *
 * getters should have the same name as the date-fns function to make it easier
 * to understand what is going on under the hood
 *
 * please keep getters in alphabetical order
 */
export class DateFns {

	static get add() {
		return add;
	}

	static get addDays() {
		return addDays;
	}

	static get addHours() {
		return addHours;
	}

	static get fromUnixTime() {
		return fromUnixTime;
	}

	static get format() {
		return format;
	}

	static get formatISO() {
		return formatISO;
	}

	static get formatDistanceToNow() {
		return formatDistanceToNow;
	}

	static get getHours() {
		return getHours;
	}

	static get getMinutes() {
		return getMinutes;
	}

	static get getSeconds() {
		return getSeconds;
	}

	static get getTimezoneName() {
		return getTimezoneName;
	}

	static get getUnixTime() {
		return getUnixTime;
	}

	static get intervalToDuration() {
		return intervalToDuration;
	}

	static get isAfter() {
		return isAfter;
	}

	static get isBefore() {
		return isBefore;
	}

	static get isDate() {
		return isDate;
	}

	static get isEqual() {
		return isEqual;
	}

	static get isFuture() {
		return isFuture;
	}

	static get isValid() {
		return isValid;
	}

	static get parseISO() {
		return parseISO;
	}

	static get set() {
		return set;
	}

	static get setDay() {
		return setDay;
	}

	static get setHours() {
		return setHours;
	}

	static get setMilliseconds() {
		return setMilliseconds;
	}

	static get setMinutes() {
		return setMinutes;
	}

	static get toDate() {
		return toDate;
	}

	static get utcToZonedTime() {
		return utcToZonedTime;
	}

	static get isSameDay() {
		return isSameDay;
	}

	static get zonedTimeToUtc() {
		return zonedTimeToUtc;
	}
}

/**
 * Since date-fns Interval object has a predictable set of keys in a predictable order
 * we can just loop through the keys, and get the first one whose value is greater than
 * 1 and return that. lastKeyUpdate = years, months, days, etc.
 * interval = the value of the difference between start/end dates
 *
 * lastKeyUpdate and interval in the return value may be undefined if there is less than
 * 1 second difference between the 2 dates
 * @param start
 * @param end
 * @returns {lastKeyUpdate: string, interval: number}
 */
export const getLastIntervalValue = (start: Date, end: Date) => {
	if (typeof start === 'string') {
		start = DateFns.parseISO(start);
	}
	if (typeof end === 'string') {
		end = DateFns.parseISO(end);
	}
	if (DateFns.isValid(start) && DateFns.isValid(end)) {
		const interval: Duration = DateFns.intervalToDuration({start, end});
		const intervalKeys = Object.keys(interval);
		let lastKeyUpdate: string;
		for (let i = 0; i < intervalKeys.length; i++) {
			const key = intervalKeys[i];
			if (interval[key] > 0) {
				lastKeyUpdate = key;
				break;
			}
		}
		return {lastKeyUpdate, interval: interval[lastKeyUpdate]};
	}
};

/**
 * Apply the default date format for a date MMM dd, yyyy
 * @param date
 */
export const formatDateDefault = (date: Date) => {
	return DateFns.format(date, 'MMM dd, yyyy');
};

/**
 * Apply the default time format for a date hh:mm a
 * @param date
 */
export const formatTimeDefault = (date: Date) => {
	return DateFns.format(date, 'hh:mm a');
};

export const formatZoneDefault = (date: Date) => {
	return DateFns.format(date, "O");
}

/**
 * Returns the timezone of a Date or Date string.
 * Credits: [StackOverflow answer by mrnateriver](https://stackoverflow.com/questions/9772955/how-can-i-get-the-timezone-name-in-javascript)
 * @param date
 */
export const getTimezoneName = (date: Date | string): string => {
	if (!date) {
		return '';
	}
	const today = new Date(date);
	const short = today.toLocaleDateString(undefined);
	const full = today.toLocaleDateString(undefined, {timeZoneName: 'long'});
	// Trying to remove date from the string in a locale-agnostic way
	const shortIndex = full.indexOf(short);
	if (shortIndex >= 0) {
		const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
		// by this time `trimmed` should be the timezone's name with some punctuation -
		// trim it from both sides
		return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
	} else {
		// in some magic case when short representation of date is not present in the long one
		// just return the long one as a fallback, since it should contain the timezone's name.
		return full;
	}
};

/**
 * Apply the default date/time format for a date MMM dd, yyyy hh:mm a
 * @param date
 */
export const formatDateTimeDefault = (date: Date) => {
	return `${formatDateDefault(date)} ${formatTimeDefault(date)}`;
};
