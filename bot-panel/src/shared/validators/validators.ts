type Validator = (value: string | undefined) => string | null;

export const minLength =
  (min: number, field: string): Validator =>
  (value) => {
    if (value === undefined) {
      return null;
    }

    if (value.trim().length < min) {
      return `${field} должно содержать минимум ${min} символов`;
    }

    return null;
  };

export const maxLength =
  (max: number, field: string): Validator =>
  (value) => {
    if (value === undefined) {
      return null;
    }

    if (value.trim().length > max) {
      return `${field} не должно превышать ${max} символов`;
    }

    return null;
  };

export const isEmail: Validator = (value) => {
  if (value === undefined) {
    return null;
  }

  if (!/^\S+@\S+$/.test(value)) {
    return 'Неверный формат email';
  }

  return null;
};

export const combineValidators =
  (...validators: Validator[]): Validator =>
  (value) => {
    for (const validator of validators) {
      const error = validator(value);

      if (error) return error;
    }

    return null;
  };
