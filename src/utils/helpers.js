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

    const variants = data.address.premisedata[0]
        .substring(1)
        .replaceAll('|;', '')
        .split('|')

    return {
        address1: data.address.address1[0],
        address2: data.address.address2[0],
        county: data.address.county[0],
        town: data.address.town[0],
        postcode: data.address.postcode[0],
        variants,
    }
}

module.exports = {
    createGfKeyFromField,
    doesObjectExist,
    filteredKeys,
    cleansePostcodeSoftwareData,
}
