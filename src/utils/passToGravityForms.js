import axios from 'axios'
import { find } from 'lodash'

export default async (singleForm, values, lambdaEndpoint) => {
    const formData = new FormData()

    for (const attribute in values) {
        if (values.hasOwnProperty(attribute)) {
            let value = values[attribute]

            const fieldId = attribute.replace('input_', '')
            const field = find(
                singleForm.formFields,
                (formField) => formField.id == fieldId
            )

            if (field && field.type === 'fileupload') {
                value = value[0]
            }

            if (field?.type === 'address') {
                value.map((val, index) =>
                    formData.append(`${attribute}.${index}`, val)
                )
            }

            formData.append(attribute, value)
        }
    }

    let result

    console.log('SINGLE FORM', singleForm)
    console.log('POST VALUES', values)

    try {
        result = await axios.post(
            `${singleForm.apiURL}/submissions`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
    } catch (error) {
        console.log(error)

        const errorResponse = error.response.data

        // Here we know this is a Gravity Form Error
        if (errorResponse.is_valid === false) {
            return {
                status: 'error',
                data: {
                    status: 'gravityFormErrors',
                    message: 'Gravity Forms has flagged issues',
                    validation_messages: errorResponse.validation_messages,
                },
            }
        } else {
            // Unknown error
            return {
                status: 'error',
                data: JSON.stringify({
                    status: 'unknown',
                    message: 'Something went wrong',
                }),
            }
        }
    }

    return {
        status: 'success',
        data: result,
    }
}
