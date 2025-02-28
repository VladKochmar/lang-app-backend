import { validationResult } from 'express-validator'

class ValidationChecker {
  static check(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const formatedErrors = {}

      errors.array().forEach(error => {
        if (formatedErrors[error.path]) {
          formatedErrors[error.path].push(error.msg)
        } else {
          formatedErrors[error.path] = error.msg
        }
      })

      return res.status(400).json({
        errors: formatedErrors,
      })
    }
  }
}

export default ValidationChecker
