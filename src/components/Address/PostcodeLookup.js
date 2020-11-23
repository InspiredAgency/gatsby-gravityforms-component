import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { parseStringPromise } from 'xml2js'
import { cleansePostcodeSoftwareData } from '../../utils/helpers'

const apiUrl = 'https://ws1.postcodesoftware.co.uk/lookup.asmx/getAddress'

function PostcodeLookup({
    fieldId,
    setValue,
    enableCompactAddress,
    handleShowAddress,
    isAddressHidden,
}) {
    const node = useRef()
    const [postcode, setPostcode] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [addressData, setAddressData] = useState(null)
    const [singleLineAddress, setSingleLineAddress] = useState(null)

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleClickOutside = (e) => {
        // Inside click
        if (node.current.contains(e.target)) return
        // Outside click
        setAddressData(null)
    }

    const handlePostcodeLookup = async () => {
        if (!postcode) return

        try {
            setErrorMessage(null)
            setIsLoading(true)

            const response = await axios.get(apiUrl, {
                params: {
                    account: process.env.GATSBY_POSTCODE_SOFTWARE_USERNAME,
                    password: process.env.GATSBY_POSTCODE_SOFTWARE_PASSWORD,
                    postcode,
                },
            })

            const rawData = await parseStringPromise(response.data, {
                normalize: true,
                normalizeTags: true,
            })

            const data = cleansePostcodeSoftwareData(rawData)

            if (data?.error) return handleError(data.error)
            else setAddressData(data)
            setIsLoading(false)
        } catch (ex) {
            handleError(
                'Something went wrong, please try again or enter address manually.',
                ex
            )
        }
    }

    const handleError = (errorMessage, exception = null) => {
        setErrorMessage(errorMessage)
        setIsLoading(false)
        if (exception) console.error(exception)
    }

    const handleSelectAddress = (variant) => {
        const firstField = `${variant} ${addressData.address1}`
        setValue(`input_${fieldId}.1`, firstField, true)
        setValue(`input_${fieldId}.2`, addressData.address2, true)
        setValue(`input_${fieldId}.3`, addressData.town, true)
        setValue(`input_${fieldId}.4`, addressData.county, true)
        setValue(`input_${fieldId}.5`, addressData.postcode, true)
        setValue(`input_${fieldId}.6`, addressData.country, true)

        if (enableCompactAddress)
            setSingleLineAddress(concatAddress(firstField))

        setAddressData(null)
        setPostcode('')
    }

    const concatAddress = (address1) => {
        if (!addressData) return null

        let address = ''
        const mappedAddress = {
            address1,
            address2: addressData.address2,
            town: addressData.town,
            county: addressData.county,
            postcode: addressData.postcode,
            country: addressData.country,
        }

        for (const [, value] of Object.entries(mappedAddress)) {
            if (!value) continue
            address += value + ', '
        }

        const result = address.trim().slice(0, -1)
        return result
    }

    const removeAddress = () => {
        setValue(`input_${fieldId}.1`, null)
        setValue(`input_${fieldId}.2`, null)
        setValue(`input_${fieldId}.3`, null)
        setValue(`input_${fieldId}.4`, null)
        setValue(`input_${fieldId}.5`, null)
        setValue(`input_${fieldId}.6`, null)

        setSingleLineAddress(null)
    }

    return (
        <div ref={node} className="gravityform__postcode_software_container">
            <div className="gravityform__postcode_software_input_group">
                <input
                    type="text"
                    placeholder="Enter postcode to find address"
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
                {enableCompactAddress && (
                    <button
                        type="button"
                        className="gravityform__postcode_software_button gravityform__postcode_software_button_enter_manually"
                        onClick={handleShowAddress}
                    >
                        Enter Manually
                    </button>
                )}
            </div>
            {errorMessage && (
                <div className="gravityform__postcode_software_error">
                    {errorMessage}
                </div>
            )}
            {addressData && (
                <div className="gravityform__postcode_software_address_list">
                    {addressData.variants.map((variant, index) => {
                        const addressText = `${variant} ${addressData.address1}`
                        return (
                            <div
                                key={index}
                                className="gravityform__postcode_software_address_list_item"
                                onClick={() => handleSelectAddress(variant)}
                            >
                                {addressText}
                            </div>
                        )
                    })}
                </div>
            )}
            {isAddressHidden && singleLineAddress && (
                <div className="gravityform__postcode_software_selected_address">
                    <div>{singleLineAddress}</div>
                    <div>
                        <button
                            type="button"
                            onClick={removeAddress}
                            className="gravityform__postcode_software_button_remove_address"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostcodeLookup

PostcodeLookup.propTypes = {
    fieldId: PropTypes.number,
    setValue: PropTypes.func,
    enableCompactAddress: PropTypes.bool,
    handleShowAddress: PropTypes.func,
    isAddressHidden: PropTypes.bool,
}
