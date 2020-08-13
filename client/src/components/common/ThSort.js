import React from 'react';
import isEqual from "lodash/isEqual";
import mapValues from "lodash/mapValues";

const icons = [
  <span className="fa fa-angle-up" aria-hidden="true"/>,
  <span className="fa fa-angle-down" aria-hidden="true"/>
];

/**
 * @param {} props
 *   order {} current sorting order
 *   orderBy {} How to order (reverse if already ordered like this)
 *   isDefault boolean Wheather orderBy is the default ordering
 * @returns {*} Table header with onClick and eventual sort direction icon
 * @constructor
 */
export default function ThSort(props) {
  const { order, orderBy, isDefault=false} = props;
  const orderByKeys = Object.keys(orderBy);
  const orderByIcon = orderBy[orderByKeys[0]].toLowerCase() === "asc" ? 0 : 1;
  const reverseOrderBy = reverseOrder(orderBy);
  let icon = null;
  let clickedOrdersBy = orderBy;
  if (order) {
    if (isEqual(Object.keys(order), Object.keys(orderBy))) {
      if (isEqual(order, orderBy)) {
        icon = icons[orderByIcon];
        clickedOrdersBy = reverseOrderBy;
      }
      if (isEqual(order, reverseOrderBy)) {
        icon = icons[Math.abs(orderByIcon-1)]; // reverseOrderByIcon
        clickedOrdersBy = orderBy;
      }
    }
  } else if (isDefault) {
    icon = icons[orderByIcon];
    clickedOrdersBy = reverseOrderBy;
  }
  return (
    <th  className="sort" onClick={e=>props.onClick(clickedOrdersBy)}><span>{props.children}</span>{icon}</th>
  );
}

function reverseOrder(orderBy) {
  return mapValues(orderBy, value =>
      value.toLowerCase() === "asc" ? "desc" : "asc"
  );
}