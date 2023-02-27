/**
 * Util to make a GraphQL query
 */

export default function gqlQuery(type: string, queryName: string, fields: Array<string | object>) : string {
    let fieldString = "";
    for (const field of fields) {
        if (typeof field === "string") {
            fieldString += field + " ";
        } else if (typeof field == "object") {
            const key = Object.keys(field)[0];
            // @ts-ignore
            const value = field[key];
            fieldString += key + " { " + value.join(" ") + " } ";
        }
    }

    return `${type} { ${queryName} { ${fieldString} } }`;
}
