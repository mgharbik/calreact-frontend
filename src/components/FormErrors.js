import React from 'react'
import PropTypes from 'prop-types'
const FormErrors = ({formErrors}) =>
  <div>
    {Object.keys(formErrors).map((formErrorField) => {
      return (
        formErrors[formErrorField].map((error) => {
          return <p key={formErrorField}>{formErrorField} {error}</p>;
        })
      )
    })}
  </div>

FormErrors.propTypes = {
  formErrors: PropTypes.object.isRequired,
}

export default FormErrors
