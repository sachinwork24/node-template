import { mockOTPService, realOTPService } from '../services/otp.service';

export const config = {
  useRealOTP: process.env.NODE_ENV === 'production',
  otpService:
    process.env.NODE_ENV === 'production' ? realOTPService : mockOTPService,
};
