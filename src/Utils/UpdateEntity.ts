import _ from 'lodash'

export default async function UpdateEntity<T>(TClass: T, origin: any, modified: any): Promise<T> { 
    const result = _.extend(origin, modified);

    await (TClass as any).update({
        ...origin
    }, {
        ...modified
    });

    return result;
}