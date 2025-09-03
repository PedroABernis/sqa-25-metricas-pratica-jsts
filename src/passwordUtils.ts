export class PasswordUtils {
  private static readonly OPTIONS = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    preventSequential: true,
    preventRepeating: true,
  };

  private static readonly SEQUENTIAL_PATTERNS = [
    /123/,
    /abc/,
    /qwe/,
    /asd/,
    /zxc/,
  ];

  public static validatePassword(password: string): boolean {
    const violations: string[] = [];
    const lowercasedPassword = password.toLowerCase();

    this.checkLength(password, violations);
    this.checkUppercase(password, violations);
    this.checkLowercase(password, violations);
    this.checkNumbers(password, violations);
    this.checkSymbols(password, violations);
    this.checkSequential(lowercasedPassword, violations);
    this.checkRepeating(password, violations);

    return violations.length === 0;
  }

  private static checkLength(password: string, violations: string[]): void {
    if (password.length < this.OPTIONS.minLength) {
      violations.push(`Senha deve ter pelo menos ${this.OPTIONS.minLength} caracteres`);
    }

    if (this.OPTIONS.maxLength && password.length > this.OPTIONS.maxLength) {
      violations.push(`Senha deve ter no máximo ${this.OPTIONS.maxLength} caracteres`);
    }
  }

  private static checkUppercase(password: string, violations: string[]): void {
    if (this.OPTIONS.requireUppercase && !/[A-Z]/.test(password)) {
      violations.push("Senha deve conter pelo menos uma letra maiúscula");
    }
  }

  private static checkLowercase(password: string, violations: string[]): void {
    if (this.OPTIONS.requireLowercase && !/[a-z]/.test(password)) {
      violations.push("Senha deve conter pelo menos uma letra minúscula");
    }
  }

  private static checkNumbers(password: string, violations: string[]): void {
    if (this.OPTIONS.requireNumbers && !/\d/.test(password)) {
      violations.push("Senha deve conter pelo menos um número");
    }
  }

  private static checkSymbols(password: string, violations: string[]): void {
    if (this.OPTIONS.requireSymbols && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(password)) {
      violations.push("Senha deve conter pelo menos um caractere especial");
    }
  }

  private static checkSequential(password: string, violations: string[]): void {
    if (this.OPTIONS.preventSequential) {
      for (const pattern of this.SEQUENTIAL_PATTERNS) {
        if (pattern.test(password)) {
          violations.push("Senha não deve conter sequências comuns");
          break;
        }
      }
    }
  }

  private static checkRepeating(password: string, violations: string[]): void {
    if (this.OPTIONS.preventRepeating) {
      if (/(.)\1{2,}/.test(password)) {
        violations.push("Senha não deve ter caracteres repetidos em excesso");
      }
    }
  }


}