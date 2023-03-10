/**
 * Util to make a GraphQL query
 */

export default function gqlQuery(type: string, queryName: string, fields: Array<string | object>, isAdded?: boolean) : string {
 	if (!type && !queryName && !fields) {
		return "";
	}   
	let fieldString = "";
    for (const field of fields) {
        if (typeof field === "string") {
            fieldString += field + " ";
        } else if (typeof field == "object") {
            const key = Object.keys(field)[0];
            // @ts-ignore
            const value = field[key];
            fieldString += `${key} { ${gqlQuery("", "", value, true)} } `;
        }
    }

    if (isAdded) {
        return fieldString;
    }

    return `${type} { ${queryName} { ${fieldString} } }`.replace(/ {2}/g," ");
}
