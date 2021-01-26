function createGfKeyFromField(string) {
    const fieldName = 'input_'
    const field = string.slice(string.indexOf(fieldName) + fieldName.length)
    return field.replace('_', '.')
}

function doesObjectExist(obj) {
    if (typeof obj !== 'undefined') {
        return true
    }
    return false
}

function filteredKeys(obj, filter) {
    let key,
        keys = []
    for (key in obj)
        if ({}.hasOwnProperty.call(obj, key) && filter.test(key)) keys.push(key)
    return keys
}

function cleansePostcodeSoftwareData(data) {
    if (!data) return null

    const error = data.address.errormessage[0]
    if (error)
        return {
            error,
        }

    const variants = data.address.premisedata[0]
        .replaceAll('|', ' ')
        .split(';')
        .map((x) => x.trim()) // Trim each item in array
        .filter((x) => x) // Only return truthy values

    return {
        address1: mapPostcodeSoftwareValue('address1', data.address),
        address2: mapPostcodeSoftwareValue('address2', data.address),
        county: mapPostcodeSoftwareValue('county', data.address),
        town: mapPostcodeSoftwareValue('town', data.address),
        postcode: mapPostcodeSoftwareValue('postcode', data.address),
        country: 'United Kingdom', // Postcode software can only return UK addresses
        variants,
    }
}

function mapPostcodeSoftwareValue(property, data) {
    return property in data ? data[property][0] : ''
}

const validLeadTrackingFields = [
    'source',
    'medium',
    'term',
    'content',
    'campaign',
    'session_count',
    'pageview_count',
]

module.exports = {
    createGfKeyFromField,
    doesObjectExist,
    filteredKeys,
    cleansePostcodeSoftwareData,
    validLeadTrackingFields,
}
