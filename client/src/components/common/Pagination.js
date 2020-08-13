import React from 'react';
import {Link} from "react-router-dom";
import {FormattedMessage} from 'react-intl';
import {parseQuery} from "../../utils/dataAccess";

export default function Pagination(props) {
    const view = props.retrieved && props.retrieved['hydra:view'];
    if (!view) return null;

    const {
        'hydra:first': first,
        'hydra:previous': previous,
        'hydra:next': next,
        'hydra:last': last
    } = view;
    if (first===undefined && last===undefined) return null;

    return (
        <nav aria-label="Page navigation">
            <Link
                to="."
                className={`btn btn-primary${previous ? '' : ' disabled'}`}
                onClick={ e => handleClick(e, props, first) }
            >
                <span aria-hidden="true">&lArr;</span> <FormattedMessage id="pagination.first" defaultMessage="First" />
            </Link>
            <Link
                to={
                    !previous || previous === first ? '.' : encodeURIComponent(previous)
                }
                className={`btn btn-primary${previous ? '' : ' disabled'}`}
                onClick={ e => handleClick(e, props, previous) }
            >
                <span aria-hidden="true">&larr;</span> <FormattedMessage id="pagination.previous" defaultMessage="Previous" />
            </Link>
            <Link
                to={next ? encodeURIComponent(next) : '#'}
                className={`btn btn-primary${next ? '' : ' disabled'}`}
                onClick={e => handleClick(e, props, next) }
            >
                <FormattedMessage id="pagination.next" defaultMessage="Next" /> <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
                to={last ? encodeURIComponent(last) : '#'}
                className={`btn btn-primary${next ? '' : ' disabled'}`}
                onClick={e => handleClick(e, props, last) }
            >
                <FormattedMessage id="pagination.last" defaultMessage="Last" /> <span aria-hidden="true">&rArr;</span>
            </Link>
        </nav>
    );
}

function handleClick(event, props, uri) {
  const {onClick, pageParameterName="page"} = props;
  if (!onClick) return;
  event.preventDefault();
  onClick(parseQuery(uri)[pageParameterName]);
}