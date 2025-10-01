// Form validation utility functions
export class FormValidator {
  static validateEmail(email: string): { isValid: boolean; message: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return { isValid: false, message: 'Email is required' };
    }
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    return { isValid: true, message: '' };
  }

  static validatePassword(password: string): { isValid: boolean; message: string } {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    return { isValid: true, message: '' };
  }

  static validateUsername(username: string): { isValid: boolean; message: string } {
    if (!username.trim()) {
      return { isValid: false, message: 'Username is required' };
    }
    if (username.length < 3) {
      return { isValid: false, message: 'Username must be at least 3 characters long' };
    }
    if (username.length > 50) {
      return { isValid: false, message: 'Username cannot exceed 50 characters' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    return { isValid: true, message: '' };
  }

  static validateFullName(fullName: string): { isValid: boolean; message: string } {
    if (!fullName.trim()) {
      return { isValid: false, message: 'Full name is required' };
    }
    if (fullName.length < 2) {
      return { isValid: false, message: 'Full name must be at least 2 characters long' };
    }
    if (fullName.length > 100) {
      return { isValid: false, message: 'Full name cannot exceed 100 characters' };
    }
    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      return { isValid: false, message: 'Full name can only contain letters and spaces' };
    }
    return { isValid: true, message: '' };
  }

  static validatePhone(phone: string): { isValid: boolean; message: string } {
    if (!phone) {
      return { isValid: true, message: '' }; // Optional field
    }
    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, message: 'Please enter a valid Bangladeshi phone number (01XXXXXXXXX)' };
    }
    return { isValid: true, message: '' };
  }

  static validateAge(age: string): { isValid: boolean; message: string } {
    if (!age) {
      return { isValid: false, message: 'Age is required' };
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
      return { isValid: false, message: 'Age must be a valid number' };
    }
    if (ageNum < 18) {
      return { isValid: false, message: 'Age must be at least 18 years' };
    }
    if (ageNum > 70) {
      return { isValid: false, message: 'Age cannot exceed 70 years' };
    }
    return { isValid: true, message: '' };
  }

  static validateRequired(value: string, fieldName: string): { isValid: boolean; message: string } {
    if (!value || !value.trim()) {
      return { isValid: false, message: `${fieldName} is required` };
    }
    return { isValid: true, message: '' };
  }

  static validateForm(formData: Record<string, string>, validationRules: Record<string, Function[]>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    let isValid = true;

    for (const [field, rules] of Object.entries(validationRules)) {
      const value = formData[field] || '';
      
      for (const rule of rules) {
        const result = rule(value);
        if (!result.isValid) {
          errors[field] = result.message;
          isValid = false;
          break; // Stop on first error for this field
        }
      }
    }

    return { isValid, errors };
  }

  // Helper function to display errors on form
  static displayErrors(errors: Record<string, string>): void {
    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.border-red-500').forEach(el => {
      el.classList.remove('border-red-500');
      el.classList.add('border-gray-300');
    });

    // Display new errors
    for (const [field, message] of Object.entries(errors)) {
      const input = document.querySelector(`[name="${field}"]`) as HTMLInputElement;
      if (input) {
        // Add error styling to input
        input.classList.remove('border-gray-300');
        input.classList.add('border-red-500');

        // Create and display error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        
        // Insert error message after input
        if (input.parentNode) {
          input.parentNode.insertBefore(errorDiv, input.nextSibling);
        }
      }
    }
  }

  // Helper function to clear all errors
  static clearErrors(): void {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.border-red-500').forEach(el => {
      el.classList.remove('border-red-500');
      el.classList.add('border-gray-300');
    });
  }
}