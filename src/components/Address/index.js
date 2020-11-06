import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import strings from '../../utils/strings'
import InputWrapper from '../InputWrapper'
import CountryDropDown from './CountryDropDown'
import PostcodeLookup from './PostcodeLookup'

const Input = ({
    errors,
    fieldData,
    name,
    register,
    enablePostcodeSoftware,
    setValue,
    ...wrapProps
}) => {
    const {
        id,
        cssClass,
        isRequired,
        maxLength,
        placeholder,
        size,
        type,
        inputs,
    } = fieldData

    const errorList = []
    errors?.map((error) => {
        errorList.push({
            id: error.ref.id,
            obj: error,
        })
    })

    return (
        <>
            {enablePostcodeSoftware && (
                <li className="gravityform__postcode_software">
                    <PostcodeLookup fieldId={id} setValue={setValue} />
                </li>
            )}
            <li>
                <ul className="gravityform__address_container">
                    {inputs.map((input) => {
                        if (input.isHidden) return

                        const inputName = `input_${input.id}`

                        const error =
                            errorList.length > 0
                                ? errorList.find((x) => x.id === inputName)
                                : null

                        const inputRequired =
                            input.label === 'Address Line 2'
                                ? false
                                : isRequired

                        return (
                            <InputWrapper
                                key={input.id}
                                errors={error?.obj}
                                inputData={{
                                    ...fieldData,
                                    isRequired: inputRequired,
                                }}
                                labelFor={inputName}
                                customLabel={input.customLabel || input.label}
                                {...wrapProps}
                            >
                                {input.label !== 'Country' && (
                                    <input
                                        aria-invalid={error?.obj}
                                        aria-required={inputRequired}
                                        className={classnames(
                                            'gravityform__field__input',
                                            `gravityform__field__input__${type}`,
                                            cssClass,
                                            size
                                        )}
                                        id={inputName}
                                        maxLength={maxLength || 524288} // 524288 = 512kb, avoids invalid prop type error if maxLength is undefined.
                                        name={inputName}
                                        placeholder={placeholder}
                                        ref={register({
                                            required:
                                                inputRequired &&
                                                strings.errors.required,
                                        })}
                                        type="text"
                                    />
                                )}
                                {input.label === 'Country' && (
                                    <CountryDropDown
                                        id={inputName}
                                        name={inputName}
                                        aria-invalid={error?.obj}
                                        aria-required={inputRequired}
                                        className={classnames(
                                            'gravityform__field__input',
                                            `gravityform__field__input__${type}`,
                                            cssClass,
                                            size
                                        )}
                                        ref={register({
                                            required:
                                                inputRequired &&
                                                strings.errors.required,
                                        })}
                                    />
                                )}
                            </InputWrapper>
                        )
                    })}
                </ul>
            </li>
        </>
    )
}

export default Input

Input.propTypes = {
    errors: PropTypes.array,
    fieldData: PropTypes.shape({
        cssClass: PropTypes.string,
        maxLength: PropTypes.number,
        placeholder: PropTypes.string,
        isRequired: PropTypes.bool,
        type: PropTypes.string,
        size: PropTypes.string,
        inputs: PropTypes.array,
    }),
    name: PropTypes.string,
    register: PropTypes.func,
    wrapProps: PropTypes.object,
    enablePostcodeSoftware: PropTypes.bool,
    setValue: PropTypes.func,
}
