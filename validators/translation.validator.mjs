class TranslationValidator {
  static translationSchema = {
    translated_word: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: 'Word is required',
      },
      matches: {
        options: /^[A-Za-z]+$/,
        errorMessage: 'Word must contain only letters and spaces',
      },
    },
    language_code: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: 'Language code is required',
      },
      isLength: {
        options: { min: 2, max: 2 },
        errorMessage: 'Language code must be 2 characters long',
      },
    },
  }
}

export default TranslationValidator
