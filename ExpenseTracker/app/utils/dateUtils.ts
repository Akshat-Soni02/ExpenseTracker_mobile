import moment from "moment";
import { parseISO, format, isValid } from "date-fns";

export const dateTime = (date: string | Date) => 
    moment(date).format("DD MMM YYYY, hh:mm A");

export const formatTime = (date: string | Date) => {
    const validDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(validDate) ? format(validDate, 'hh:mm a') : '';
};

export const formatDate = (date: string | Date) => 
    format(new Date(date), "MMMM dd, yyyy");

export const isToday = (date: string | Date) => {
    let dateToCheck = moment(date);
    let today = moment().startOf('day');
    return dateToCheck.isSame(today, "day");
}