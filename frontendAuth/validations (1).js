// Validation Utility Functions

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Phone validation regex (Indian format)
 */
const PHONE_REGEX = /^[6-9]\d{9}$/;

/**
 * Password validation regex (min 8 chars, at least 1 letter, 1 number)
 */
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {object} Validation result { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validatePassword = (password, options = {}) => {
  const { minLength = 8, requireUppercase = true, requireNumber = true, requireSpecial = false } = options;
  
  if (!password || password.trim() === '') {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < minLength) {
    return { isValid: false, message: `Password must be at least ${minLength} characters` };
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (requireNumber && !/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (requireSpecial && !/[@$!%*#?&]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {object} Validation result
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length !== 10) {
    return { isValid: false, message: 'Phone number must be 10 digits' };
  }
  
  if (!PHONE_REGEX.test(cleanPhone)) {
    return { isValid: false, message: 'Please enter a valid Indian phone number' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
export const validateName = (name, fieldName = 'Name') => {
  if (!name || name.trim() === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters` };
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { isValid: false, message: `${fieldName} can only contain letters, spaces, hyphens and apostrophes` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate required field
 * @param {*} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value || value.length < minLength) {
    return { isValid: false, message: `${fieldName} must be at least ${minLength} characters` };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return { isValid: false, message: `${fieldName} must not exceed ${maxLength} characters` };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
export const validateRange = (value, min, max, fieldName = 'This field') => {
  const num = Number(value);
  
  if (isNaN(num)) {
    return { isValid: false, message: `${fieldName} must be a valid number` };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, message: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, message: `${fieldName} must not exceed ${max}` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate PIN code (Indian)
 * @param {string} pincode - PIN code to validate
 * @returns {object} Validation result
 */
export const validatePincode = (pincode) => {
  if (!pincode || pincode.trim() === '') {
    return { isValid: false, message: 'PIN code is required' };
  }
  
  const cleanPincode = pincode.replace(/\D/g, '');
  
  if (cleanPincode.length !== 6) {
    return { isValid: false, message: 'PIN code must be 6 digits' };
  }
  
  if (!/^[1-9]\d{5}$/.test(cleanPincode)) {
    return { isValid: false, message: 'Please enter a valid PIN code' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate credit card number (Luhn algorithm)
 * @param {string} cardNumber - Card number to validate
 * @returns {object} Validation result
 */
export const validateCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.trim() === '') {
    return { isValid: false, message: 'Card number is required' };
  }
  
  const clean = cardNumber.replace(/\s|-/g, '');
  
  if (!/^\d{13,19}$/.test(clean)) {
    return { isValid: false, message: 'Please enter a valid card number' };
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return { isValid: false, message: 'Invalid card number' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate CVV
 * @param {string} cvv - CVV to validate
 * @returns {object} Validation result
 */
export const validateCVV = (cvv) => {
  if (!cvv || cvv.trim() === '') {
    return { isValid: false, message: 'CVV is required' };
  }
  
  if (!/^\d{3,4}$/.test(cvv)) {
    return { isValid: false, message: 'CVV must be 3 or 4 digits' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate expiry date (MM/YY format)
 * @param {string} expiry - Expiry date to validate
 * @returns {object} Validation result
 */
export const validateExpiryDate = (expiry) => {
  if (!expiry || expiry.trim() === '') {
    return { isValid: false, message: 'Expiry date is required' };
  }
  
  const match = expiry.match(/^(\d{2})\/(\d{2,4})$/);
  
  if (!match) {
    return { isValid: false, message: 'Expiry date must be in MM/YY format' };
  }
  
  const month = parseInt(match[1], 10);
  let year = parseInt(match[2], 10);
  
  if (month < 1 || month > 12) {
    return { isValid: false, message: 'Invalid month' };
  }
  
  // Convert 2-digit year to 4-digit
  if (year < 100) {
    year += 2000;
  }
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, message: 'Card has expired' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate UPI ID
 * @param {string} upiId - UPI ID to validate
 * @returns {object} Validation result
 */
export const validateUPI = (upiId) => {
  if (!upiId || upiId.trim() === '') {
    return { isValid: false, message: 'UPI ID is required' };
  }
  
  if (!/^[a-zA-Z0-9.-]+@[a-zA-Z]+$/.test(upiId)) {
    return { isValid: false, message: 'Please enter a valid UPI ID (e.g., name@upi)' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate form object
 * @param {object} values - Form values
 * @param {object} rules - Validation rules
 * @returns {object} Validation results { isValid: boolean, errors: object }
 */
export const validateForm = (values, rules) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = values[field];
    
    for (const rule of fieldRules) {
      let result;
      
      switch (rule.type) {
        case 'required':
          result = validateRequired(value, rule.fieldName || field);
          break;
        case 'email':
          result = validateEmail(value);
          break;
        case 'password':
          result = validatePassword(value, rule.options);
          break;
        case 'phone':
          result = validatePhone(value);
          break;
        case 'name':
          result = validateName(value, rule.fieldName || field);
          break;
        case 'minLength':
          result = validateMinLength(value, rule.min, rule.fieldName || field);
          break;
        case 'maxLength':
          result = validateMaxLength(value, rule.max, rule.fieldName || field);
          break;
        case 'range':
          result = validateRange(value, rule.min, rule.max, rule.fieldName || field);
          break;
        case 'pincode':
          result = validatePincode(value);
          break;
        case 'match':
          result = value === values[rule.matchField] 
            ? { isValid: true, message: '' }
            : { isValid: false, message: rule.message || `${field} must match ${rule.matchField}` };
          break;
        case 'custom':
          result = rule.validator(value, values);
          break;
        default:
          result = { isValid: true, message: '' };
      }
      
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        break;
      }
    }
  }
  
  return { isValid, errors };
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateRange,
  validatePincode,
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
  validateUPI,
  validateForm,
  sanitizeInput,
};
