import Link from "next/link";
import { PagedCollection } from "../../types/collection";
import { FormattedMessage, useIntl } from "react-intl";

interface Props {
  collection: PagedCollection<unknown>;
  // eslint-disable-next-line no-unused-vars
  getPagePath: (path: string) => string;
}

const Pagination = ({ collection, getPagePath }: Props) => {
  const intl = useIntl();
  const view = collection && collection["hydra:view"];
  if (!view) return null;

  const {
    "hydra:first": first,
    "hydra:previous": previous,
    "hydra:next": next,
    "hydra:last": last,
  } = view;

  return (
    <div className="text-center">
      <nav
        className="text-xs font-bold inline-flex mx-auto divide-x-2 divide-gray-200 flex-row flex-wrap items-center justify-center mb-4 border-2 border-gray-200 rounded-2xl overflow-hidden"
        aria-label="Page navigation"
      >
        <Link
          href={first ? getPagePath(first) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            previous ? "" : " text-gray-500 pointer-events-none"
          }`}
          aria-label={intl.formatMessage({
            id: "pagination.first_label",
            defaultMessage: "First page",
          })}
        >
          <span aria-hidden="true">&lArr;</span>{" "}
          <FormattedMessage id="pagination.first" defaultMessage="First" />
        </Link>
        <Link
          href={previous ? getPagePath(previous) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            previous ? "" : " text-gray-500 pointer-events-none"
          }`}
          aria-label={intl.formatMessage({
            id: "pagination.previous_label",
            defaultMessage: "Previous Page",
          })}
        >
          <span aria-hidden="true">&larr;</span>{" "}
          <FormattedMessage
            id="pagination.previous"
            defaultMessage="Previous"
          />
        </Link>
        <Link
          href={next ? getPagePath(next) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            next ? "" : " text-gray-500 pointer-events-none"
          }`}
          aria-label={intl.formatMessage({
            id: "pagination.next_label",
            defaultMessage: "Next Page",
          })}
        >
          <FormattedMessage id="pagination.next" defaultMessage="Next" />{" "}
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          href={last ? getPagePath(last) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            next ? "" : "text-gray-500 pointer-events-none"
          }`}
          aria-label={intl.formatMessage({
            id: "pagination.last_label",
            defaultMessage: "Last Page",
          })}
        >
          <FormattedMessage id="pagination.last" defaultMessage="Last" />{" "}
          <span aria-hidden="true">&rArr;</span>
        </Link>
      </nav>
    </div>
  );
};

export default Pagination;
