import { DateTime } from "luxon";

export function getDateNow() {
    return DateTime
        .now()
        .toISO();
};

export function convertDateToPrint(ISO: string) {
    return DateTime
        .fromISO(new Date(ISO)
            .toISOString())
        .toLocaleString(DateTime.DATETIME_SHORT);
};