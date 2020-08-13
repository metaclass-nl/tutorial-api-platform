import React from 'react';
import {Link} from "react-router-dom";

/**
 * React component rendering link(s) to show one or more entities
 * @param props
 *     type: string used in url
 *     items: entity or array of entity to show if (one of) the link(s) is followed
 *     labelProp: string name of the http://schema.org/name property, if undefined @id is used
 *     up: wheather to start the url with an extra ../
 * @returns {*}
 * @constructor
 */
export default function EntityLinks(props) {
    const { type, items, labelProp = "@id", up } = props;
    if (items === undefined) {
        return null;
    }
    if (Array.isArray(items)) {
        return items.map((item, i) => (
            <div key={i}><EntityLinks type={type} items={item} labelProp={labelProp} up={up} /></div>
        ));
    }
    const upTo = up ? "../" : "";
    return (
        <Link to={`${upTo}../${type}/show/${encodeURIComponent(items["@id"])}`}>{items[labelProp]}</Link>
    );
}
