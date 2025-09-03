export class CPFUtils {
  private static readonly CONSTANTS = {
    CPF_LENGTH: 11,
    FIRST_DIGIT_POSITION: 9,
    SECOND_DIGIT_POSITION: 10,
    DIVISOR: 11,
    FIRST_WEIGHTS_LENGTH: 9,
    SECOND_WEIGHTS_LENGTH: 10,
    FIRST_WEIGHTS_START: 10,
    SECOND_WEIGHTS_START: 11,
  };

  private static readonly FIRST_DIGIT_WEIGHTS = this.generateFirstDigitWeights();
  private static readonly SECOND_DIGIT_WEIGHTS = this.generateSecondDigitWeights();

  public static validateCPF(cpf: string): boolean {
    const cleaned = this.unmaskCPF(cpf);

    if (cleaned.length !== this.CONSTANTS.CPF_LENGTH || this.hasAllSameDigits(cleaned)) {
      return false;
    }

    const firstVerifierDigit = this.calculateVerifierDigit(cleaned.substring(0, 9), this.FIRST_DIGIT_WEIGHTS);
    const secondVerifierDigit = this.calculateVerifierDigit(cleaned.substring(0, 10), this.SECOND_DIGIT_WEIGHTS);

    return (
      parseInt(cleaned.charAt(this.CONSTANTS.FIRST_DIGIT_POSITION)) === firstVerifierDigit &&
      parseInt(cleaned.charAt(this.CONSTANTS.SECOND_DIGIT_POSITION)) === secondVerifierDigit
    );
  }

  private static hasAllSameDigits(cpf: string): boolean {
    return new RegExp(`^(\\d)\\1{${this.CONSTANTS.CPF_LENGTH - 1}}$`).test(cpf);
  }

  private static calculateVerifierDigit(
    partialCPF: string,
    weights: number[]
  ): number {
    const sum = weights.reduce(
      (acc, weight, idx) => acc + parseInt(partialCPF.charAt(idx)) * weight,
      0
    );

    const remainder = sum % this.CONSTANTS.DIVISOR;
    return remainder < 2 ? 0 : this.CONSTANTS.DIVISOR - remainder;
  }

  private static generateFirstDigitWeights(): number[] {
    return Array.from({ length: this.CONSTANTS.FIRST_WEIGHTS_LENGTH }, (_, i) => this.CONSTANTS.FIRST_WEIGHTS_START - i);
  }

  private static generateSecondDigitWeights(): number[] {
    return Array.from({ length: this.CONSTANTS.SECOND_WEIGHTS_LENGTH }, (_, i) => this.CONSTANTS.SECOND_WEIGHTS_START - i);
  }

  public static maskCPF(cpf: string): string {
    const cleaned = this.unmaskCPF(cpf);

    if (cleaned.length !== this.CONSTANTS.CPF_LENGTH) {
      throw new Error(`CPF must have ${this.CONSTANTS.CPF_LENGTH} digits`);
    }

    return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  public static unmaskCPF(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  public static generateValidCPF(): string {
    const partialCPF = this.generateRandomDigits(9);

    const firstDigit = this.calculateVerifierDigit(partialCPF, this.FIRST_DIGIT_WEIGHTS);
    const secondDigit = this.calculateVerifierDigit(partialCPF + firstDigit, this.SECOND_DIGIT_WEIGHTS);

    return partialCPF + firstDigit + secondDigit;
  }

  private static generateRandomDigits(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
  }

  public static isValidFormat(cpf: string): boolean {
    const formats = [
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      new RegExp(`^\\d{${this.CONSTANTS.CPF_LENGTH}}$`),
      /^\d{0,3}(\.\d{0,3})?(\.\d{0,3})?(-\d{0,2})?$/,
    ];
    return formats.some((regex) => regex.test(cpf));
  }
}