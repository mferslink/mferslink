import * as dayjs from 'dayjs';
let relativeTime = require('dayjs/plugin/relativeTime')
let customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat)

export function fromNow(date: string) {
    // @ts-ignore
    return dayjs().from(dayjs(date), true);
};

export function formatTime(date: string, format = 'YYYY-MM-DD HH:mm') {
    // @ts-ignore
    return dayjs(date).format(format);
}