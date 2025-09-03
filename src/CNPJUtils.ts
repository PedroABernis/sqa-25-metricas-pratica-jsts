export class CNPJUtils {
  private static readonly CNPJ_CONSTANTS = {
    LENGTH: 14,
    PARTIAL_LENGTH: 12,
    FIRST_VERIFIER_POSITION: 12,
    SECOND_VERIFIER_POSITION: 13,
    DIVISOR: 11,
  };

  private static readonly REPEAT_DIGITS_REGEX = new RegExp(`^(\\d)\\1{${CNPJUtils.CNPJ_CONSTANTS.LENGTH - 1}}$`);
  private static readonly MASK_REGEX = new RegExp(`^(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})$`);

  private static readonly WEIGHTS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  private static readonly WEIGHTS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  public static validateCNPJ(cnpj: string): boolean {
    const cleaned = this.unmaskCNPJ(cnpj);

    if (!this.hasValidLength(cleaned) || this.hasAllSameDigits(cleaned)) {
      return false;
    }

    const firstDigit = this.calculateVerifierDigit(cleaned, this.WEIGHTS_1);
    const secondDigit = this.calculateVerifierDigit(cleaned, this.WEIGHTS_2);

    return (
      Number(cleaned.charAt(this.CNPJ_CONSTANTS.FIRST_VERIFIER_POSITION)) === firstDigit &&
      Number(cleaned.charAt(this.CNPJ_CONSTANTS.SECOND_VERIFIER_POSITION)) === secondDigit
    );
  }

  private static hasValidLength(cnpj: string): boolean {
    return cnpj.length === this.CNPJ_CONSTANTS.LENGTH;
  }

  private static hasAllSameDigits(cnpj: string): boolean {
    return new RegExp(`^(\\d)\\1{${this.CNPJ_CONSTANTS.LENGTH - 1}}$`).test(cnpj);
  }

  private static calculateVerifierDigit(cnpj: string, weights: number[]): number {
    const sum = weights.reduce(
      (acc, weight, idx) => acc + Number(cnpj.charAt(idx)) * weight,
      0
    );
    const remainder = sum % this.CNPJ_CONSTANTS.DIVISOR;
    return remainder < 2 ? 0 : this.CNPJ_CONSTANTS.DIVISOR - remainder;
  }

  public static maskCNPJ(cnpj: string): string {
    const cleaned = this.unmaskCNPJ(cnpj);

    if (cleaned.length !== this.CNPJ_CONSTANTS.LENGTH) {
      throw new Error(`CNPJ deve ter ${this.CNPJ_CONSTANTS.LENGTH} dígitos`);
    }

    return cleaned.replace(
      this.MASK_REGEX,
      "$1.$2.$3/$4-$5"
    );
  }

  public static unmaskCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, "");
  }

  public static generateValidCNPJ(): string {
    let partial = this.generateRandomDigits(this.CNPJ_CONSTANTS.PARTIAL_LENGTH);
    const firstDigit = this.calculateVerifierDigit(partial, this.WEIGHTS_1);
    partial += firstDigit.toString();

    const secondDigit = this.calculateVerifierDigit(partial, this.WEIGHTS_2);
    partial += secondDigit.toString();

    return partial;
  }

  private static generateRandomDigits(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
  }

  public static isValidFormat(cnpj: string): boolean {
    const formats = [
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
      new RegExp(`^\\d{${this.CNPJ_CONSTANTS.LENGTH}}$`),
      /^\d{0,2}(\.\d{0,3})?(\.\d{0,3})?(\/\d{0,4})?(-\d{0,2})?$/
    ];
    return formats.some((regex) => regex.test(cnpj));
  }
}