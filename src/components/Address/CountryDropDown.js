import React, { forwardRef } from 'react'
import { overwrite, getNames } from 'country-list'

overwrite([
    {
        code: 'GB',
        name: 'United Kingdom',
    },
])

function CountryDropDown({ defaultValue, ...rest }, ref) {
    const contries = getNames().sort()
    return (
        <select ref={ref} defaultValue={defaultValue || null} {...rest}>
            <option value="">Select a country</option>
            {contries.map((country) => (
                <option key={country} value={country}>
                    {country}
                </option>
            ))}
        </select>
    )
}

const forewardCountryDropDown = forwardRef(CountryDropDown)
export default forewardCountryDropDown
