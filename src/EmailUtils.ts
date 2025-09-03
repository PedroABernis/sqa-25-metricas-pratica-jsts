export class EmailUtils {
  private static readonly CONSTANTS = {
    MAX_LOCAL_PART_LENGTH: 64,
    MAX_DOMAIN_PART_LENGTH: 253,
  };

  public static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return false;
    }

    const [localPart, domainPart] = email.split('@');

    if (!this.validateLengths(localPart, domainPart)) {
      return false;
    }

    if (!this.validatePartFormats(localPart, domainPart)) {
      return false;
    }

    return true;
  }

  private static validateLengths(localPart: string, domainPart: string): boolean {
    return localPart.length <= this.CONSTANTS.MAX_LOCAL_PART_LENGTH &&
           domainPart.length <= this.CONSTANTS.MAX_DOMAIN_PART_LENGTH;
  }

  private static validatePartFormats(localPart: string, domainPart: string): boolean {
    const hasInvalidLocalPartFormat = localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..');
    const hasInvalidDomainPartFormat = domainPart.startsWith('.') || domainPart.endsWith('.') || domainPart.includes('..');

    return !(hasInvalidLocalPartFormat || hasInvalidDomainPartFormat);
  }

  public static extractDomain(email: string): string | null {
    if (!this.validateEmail(email)) {
      return null;
    }
    const parts = email.split('@');
    return parts[1] || null;
  }

  public static extractLocalPart(email: string): string | null {
    if (!this.validateEmail(email)) {
      return null;
    }
    const parts = email.split('@');
    return parts[0] || null;
  }

  public static isFromDomain(email: string, domain: string): boolean {
    if (!this.validateEmail(email) || !domain) {
      return false;
    }

    const extractedDomain = this.extractDomain(email);
    if (!extractedDomain) {
      return false;
    }

    const normalizedExtractedDomain = extractedDomain.toLowerCase();
    const normalizedDomain = domain.toLowerCase();

    return normalizedExtractedDomain === normalizedDomain || normalizedExtractedDomain.endsWith('.' + normalizedDomain);
  }

  public static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}