import { useEffect } from 'react'
import qs from 'query-string'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import strings from '../../utils/strings'
import InputWrapper from '../InputWrapper'

const Input = ({
    errors,
    fieldData,
    name,
    register,
    value,
    setValue,
    ...wrapProps
}) => {
    const {
        id,
        cssClass,
        inputMaskValue,
        isRequired,
        maxLength,
        placeholder,
        size,
        type,
        allowsPrepopulate,
        inputName,
    } = fieldData
    const regex = inputMaskValue ? new RegExp(inputMaskValue) : false

    useEffect(() => {
        if (!allowsPrepopulate) return

        if (typeof window !== 'undefined') {
            const qsData = qs.parse(window.location.search)
            // Check the window object for matching prop. Usually added via Google.
            let inputValue = window[inputName]
            console.log('GTM value', inputValue)
            // If a querystring has been passed, overwrite the value
            qsData[inputName] && (inputValue = qsData[inputName])

            setValue(`input_${id}`, inputValue)
        }
    }, [])

    return (
        <InputWrapper
            errors={errors}
            inputData={fieldData}
            labelFor={name}
            {...wrapProps}
        >
            <input
                aria-invalid={errors}
                aria-required={isRequired}
                className={classnames(
                    'gravityform__field__input',
                    `gravityform__field__input__${type}`,
                    cssClass,
                    size
                )}
                defaultValue={value}
                id={name}
                maxLength={maxLength || 524288} // 524288 = 512kb, avoids invalid prop type error if maxLength is undefined.
                name={name}
                placeholder={placeholder}
                ref={register({
                    required: isRequired && strings.errors.required,
                    maxlength: {
                        value: maxLength > 0 && maxLength,
                        message:
                            maxLength > 0 &&
                            `${strings.errors.maxChar.front}  ${maxLength} ${strings.errors.maxChar.back}`,
                    },
                    pattern: {
                        value: regex,
                        message: regex && strings.errors.pattern,
                    },
                })}
                type={type === 'phone' ? 'tel' : type}
            />
        </InputWrapper>
    )
}

export default Input

Input.propTypes = {
    errors: PropTypes.object,
    fieldData: PropTypes.shape({
        cssClass: PropTypes.string,
        inputMaskValue: PropTypes.string,
        maxLength: PropTypes.number,
        placeholder: PropTypes.string,
        isRequired: PropTypes.bool,
        type: PropTypes.string,
        size: PropTypes.string,
    }),
    name: PropTypes.string,
    register: PropTypes.func,
    value: PropTypes.string,
    wrapProps: PropTypes.object,
}
