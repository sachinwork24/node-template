//CODE For SMS otp integration goes here
export const mockOTPService = {
  generateOTP: () => '1234', // Always returns same OTP for testing
  sendOTP: async (phoneNumber: string, otp: string) => {
    console.log(`Mock OTP ${otp} sent to ${phoneNumber}`);
    return Promise.resolve();
  },
};
export class realOTPService {
  static generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
  static sendOTP(phoneNumber: string, otp: string) {
    try {
      console.log('sent otp');
    } catch (err) {
      throw new Error('Failed to send otp');
    }
  }
}
