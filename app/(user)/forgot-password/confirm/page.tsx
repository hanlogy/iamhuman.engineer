import { FORGOT_PASSWORD_KEY } from '@/definitions';
import { createCookieHelper } from '@/server/createCookieHelper';
import ConfirmForm from './ConfirmForm';

export default async function ConfirmForgotPasswordPage() {
  const { getCookie } = await createCookieHelper();

  const email = getCookie(FORGOT_PASSWORD_KEY);
  if (!email) {
    return <></>;
  }

  return <ConfirmForm email={email} />;
}
