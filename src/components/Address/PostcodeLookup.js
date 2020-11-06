import React, { useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { parseStringPromise } from 'xml2js'
import { cleansePostcodeSoftwareData } from '../../utils/helpers'

function PostcodeLookup({ fieldId, setValue }) {
    const [postcode, setPostcode] = useState('')
    const [isError, setIsError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [addressData, setAddressData] = useState(null)

    const handlePostcodeLookup = async () => {
        if (!postcode) return

        try {
            setIsLoading(true)
            const response = await axios.get(
                'https://ws1.postcodesoftware.co.uk/lookup.asmx/getAddress?account=test&password=test&postcode=LS185NJ'
            )

            //TODO: Throw an error in this block
            //TODO: Test a blank response in rawData (if an address can not be found)
            const rawData = await parseStringPromise(response.data, {
                normalize: true,
                normalizeTags: true,
            })
            //console.log('Raw Data', rawData)
            const data = cleansePostcodeSoftwareData(rawData)

            if (data) {
                console.log(data)
                setIsLoading(false)
                setAddressData(data)
            }
        } catch (err) {
            console.error(err)
            setIsError(err.message)
        }
    }

    const handleSelectAddress = (variant) => {
        const firstField = `${variant} ${addressData.address1}`
        setValue(`input_${fieldId}.1`, firstField, true)
        setValue(`input_${fieldId}.2`, addressData.address2, true)
        setValue(`input_${fieldId}.3`, addressData.town, true)
        setValue(`input_${fieldId}.5`, addressData.postcode, true)
    }

    return (
        <>
            <input
                type="text"
                placeholder="Postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="gravityform__postcode_software_textfield"
            />
            <button
                type="button"
                onClick={handlePostcodeLookup}
                className="gravityform__postcode_software_button"
            >
                {isLoading ? 'Loading...' : 'Find Address'}
            </button>
            {isError && (
                <div className="gravityform__postcode_software_error">
                    Something went wrong, please enter address manually.
                </div>
            )}
            {addressData && (
                <div className="gravityform__postcode_software_address_list">
                    {addressData.variants.map((variant) => (
                        <div
                            key={variant}
                            className="gravityform__postcode_software_address_list_item"
                            onClick={() => handleSelectAddress(variant)}
                        >
                            {variant}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default PostcodeLookup

PostcodeLookup.propTypes = {
    fieldId: PropTypes.number,
    setValue: PropTypes.func,
}
