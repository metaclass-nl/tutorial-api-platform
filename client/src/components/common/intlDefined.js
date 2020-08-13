import React from 'react';
import {FormattedMessage, FormattedNumber as IntlFormattedNumber, FormattedDate as IntlFormattedDate, FormattedTime as IntlFormattedTime} from 'react-intl';

/**
 *  Some components that render null if value===undefined
 */

/** If value defined, render localized representation */
export function LocalizedBool(props)
{
    if (props.value===undefined) {
        return null;
    }
    return props.value
        ? <FormattedMessage id="true" defaultMessage={"Yes"}/>
        : <FormattedMessage id="false" defaultMessage={"No"}/>
}

/** Do not render 'NaN' if value===undefined */
export function FormattedNumber(props) {
    if (props.value===undefined) {
        return null;
    }
    return <IntlFormattedNumber {...props}/>;
}

/** Do not format the current date if value===undefined */
export function FormattedDate(props) {
    if (props.value===undefined) {
        return null;
    }
    return <IntlFormattedDate {...props}/>;
}

/** Do not format the current time if value===undefined */
export function FormattedTime(props) {
    if (props.value===undefined) {
        return null;
    }
    return <IntlFormattedTime {...props}/>;
}

/**
 * Allways format both date and time, except:
 * Do not format the current date and time if value===undefined */
export function FormattedDateTime(props)
{
    if (props.value===undefined) {
        return null;
    }
    const extensible = {...props}
    if (props.hour===undefined) {
        extensible.hour = 'numeric';
    }
    if (props.minute===undefined) {
        extensible.minute = 'numeric';
    }
    if (props.year===undefined) {
        extensible.year = 'numeric';
    }
    if (props.month===undefined) {
        extensible.month = 'numeric';
    }
    if (props.day===undefined) {
        extensible.day = 'numeric';
    }
    return <IntlFormattedDate {...extensible}/>;
}
