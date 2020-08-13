import React from 'react';
import {Link} from "react-router-dom";
import {FormattedMessage} from 'react-intl';

export default function Pagination(props) {
    const view = props.retrieved && props.retrieved['hydra:view'];
    if (!view) return null;

    const {
        'hydra:first': first,
        'hydra:previous': previous,
        'hydra:next': next,
        'hydra:last': last
    } = view;

    return (
        <nav aria-label="Page navigation">
            <Link
                to="."
                className={`btn btn-primary${previous ? '' : ' disabled'}`}
            >
                <span aria-hidden="true">&lArr;</span> <FormattedMessage id="pagination.first" defaultMessage="First" />
            </Link>
            <Link
                to={
                    !previous || previous === first ? '.' : encodeURIComponent(previous)
                }
                className={`btn btn-primary${previous ? '' : ' disabled'}`}
            >
                <span aria-hidden="true">&larr;</span> <FormattedMessage id="pagination.previous" defaultMessage="Previous" />
            </Link>
            <Link
                to={next ? encodeURIComponent(next) : '#'}
                className={`btn btn-primary${next ? '' : ' disabled'}`}
            >
                <FormattedMessage id="pagination.next" defaultMessage="Next" /> <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
                to={last ? encodeURIComponent(last) : '#'}
                className={`btn btn-primary${next ? '' : ' disabled'}`}
            >
                <FormattedMessage id="pagination.last" defaultMessage="Last" /> <span aria-hidden="true">&rArr;</span>
            </Link>
        </nav>
    );
}