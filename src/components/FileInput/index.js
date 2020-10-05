import React from 'react';
import InputWrapper from '../../components/InputWrapper';
import classnames from 'classnames';

const noop = () => {};

const FileInput = ({
  errors,
  fieldData,
  name,
  register,
  value,
  selectedFile,
  onChange = noop,
  ...wrapProps
}) => {
  const { cssClass, isRequired, size } = fieldData;

  return (
    <InputWrapper
      errors={errors}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <div>
        <input
          aria-invalid={errors}
          aria-required={isRequired}
          className={classnames(
            'gravityform__field__input',
            'gravityform__field__input__fileupload',
            'gfield_fileupload',
            cssClass,
            size,
          )}
          id={name}
          name={name}
          ref={register({
            required: isRequired && 'This field is required',
          })}
          type="file"
          onChange={e => {
            onChange(e.target.files[0]);
          }}
        />
        {selectedFile && <div className="gravityform__field__input__fileupload_filename">{selectedFile.name}</div>}
      </div>
    </InputWrapper>
  );
};

export default FileInput;
