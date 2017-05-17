export class DateTime extends Date {
    constructor() {
        super(...arguments);
        this.locale = {
            monthNames: [],
            monthNamesShort: [],
            weekDays: [],
            weekDaysShort: [],
            dateTimeSep: ' ',
            timeSep: ':',
            dateSep: '/'
        };
        this.char2param = {
            Y: 'FullYear',
            y: 'Year',
            n: 'Month',
            m: 'Month',
            M: 'Month',
            d: 'Date',
            j: 'Date',
            D: 'Day',
            l: 'Day',
            h: 'Hours',
            H: 'Hours',
            i: 'Minutes',
            s: 'Seconds'
        };
        this.leadingZeros = ['d', 'm', 'H', 'h', 'i', 's'];
    }
    addZero(param) {
        return (param < 10 ? '0' : '') + param;
    }
    getEqParam(char) {
        let param = char;
        if (this.char2param[char]) {
            let getter = `get${this.char2param[char]}`;
            param = this[getter]();
            switch (char) {
                case 'D':
                    param = this.locale.weekDaysShort[param];
                    break;
                case 'l':
                    param = this.locale.weekDays[param];
                    break;
                case 'M':
                    param = this.locale.monthNamesShort[param];
                    break;
                case 'h':
                    param = param % 12;
                    break;
                case 'm':
                    param++;
            }
            if (this.leadingZeros.indexOf(char) >= 0) {
                param = this.addZero(param);
            }
        }
        return param;
    }
    validateTime(hour, minute = 0, second = 0) {
        let milliseconds = 0;
        if (0 < hour && hour < 25)
            milliseconds += hour * 60 * 60;
        if (0 < minute && minute < 60)
            milliseconds += minute * 60;
        if (0 < second && second < 60)
            milliseconds += second;
        return milliseconds * 1000;
    }
    validate(date, hasTime = false) {
        let result = 0;
        if (!date)
            return result;
        let [dateStr, timeStr] = date.split(this.locale.dateTimeSep);
        if (!dateStr)
            return result;
        let dateParts = dateStr.split(this.locale.dateSep);
        if (!dateParts || dateParts.length != 3)
            return result;
        result = this.validateLocale(+dateParts[0], +dateParts[1], +dateParts[2]);
        if (hasTime && timeStr) {
            let timeParts = timeStr.split(this.locale.timeSep);
            if (timeParts.length >= 2) {
                result += this.validateTime(+timeParts[0], +timeParts[1], +timeParts[2]);
            }
        }
        return result;
    }
    format(format) {
        let parsed = '';
        for (let i = 0, il = format.length; i < il; ++i) {
            parsed += this.getEqParam(format[i]);
        }
        return parsed;
    }
}
