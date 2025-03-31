import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return '서버 설정 오류가 발생했습니다. 관리자에게 문의하세요.';
      case 'AccessDenied':
        return '액세스가 거부되었습니다. 로그인할 권한이 없습니다.';
      case 'Verification':
        return '인증 링크가 만료되었거나 이미 사용되었습니다.';
      case 'OAuthSignin':
        return 'OAuth 공급자 로그인 중 오류가 발생했습니다.';
      case 'OAuthCallback':
        return 'OAuth 공급자에서 콜백 처리 중 오류가 발생했습니다.';
      case 'OAuthCreateAccount':
        return 'OAuth 계정 생성 중 오류가 발생했습니다.';
      case 'EmailCreateAccount':
        return '이메일 계정 생성 중 오류가 발생했습니다.';
      case 'Callback':
        return '콜백 처리 중 오류가 발생했습니다.';
      case 'OAuthAccountNotLinked':
        return '이 이메일로 다른 공급자를 통해 이미 로그인했습니다. 이전에 사용한 방법으로 로그인하세요.';
      case 'EmailSignin':
        return '이메일 전송 중 오류가 발생했습니다.';
      case 'CredentialsSignin':
        return '로그인에 실패했습니다. 입력하신 정보를 확인해주세요.';
      case 'SessionRequired':
        return '이 페이지에 접근하려면 로그인이 필요합니다.';
      default:
        return '인증 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
  };

  const getErrorDescription = () => {
    switch (error) {
      case 'Configuration':
        return '서버의 환경 변수나 설정 파일에 문제가 있습니다.';
      case 'AccessDenied':
        return '계정이 잠겼거나 권한이 없을 수 있습니다.';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
        return '공급자(Google, GitHub 등)에 연결하는 과정에서 문제가 발생했습니다. 다시 시도하거나 다른 로그인 방법을 사용해보세요.';
      case 'OAuthAccountNotLinked':
        return '동일한 이메일을 사용하지만 다른 로그인 방법으로 계정을 만들었습니다. 일관된 로그인 방법을 사용해주세요.';
      case 'CredentialsSignin':
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
      default:
        return '문제가 지속되면 고객 지원팀에 문의하세요.';
    }
  };

  const getErrorAction = () => {
    switch (error) {
      case 'Configuration':
        return '관리자에게 문의';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
        return '다른 로그인 방법 시도';
      case 'OAuthAccountNotLinked':
        return '이전 로그인 방법 사용';
      case 'CredentialsSignin':
        return '다시 시도';
      case 'Verification':
        return '새 링크 요청';
      default:
        return '로그인 페이지로 돌아가기';
    }
  };

  return (
    <>
      <Head>
        <title>인증 오류 - 한자로(韓字路)</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="flex justify-center">
              <h1 className="text-4xl font-bold text-primary">한자로</h1>
              <span className="ml-2 text-2xl">(韓字路)</span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              인증 오류 발생
            </h2>
            <div className="mt-2 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {getErrorMessage()}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {getErrorDescription()}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                오류 코드: {error}
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/auth/signin" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
              로그인 페이지로 돌아가기
            </Link>
            <Link href="/" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              홈으로
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              도움이 필요하신가요?{' '}
              <a href="mailto:support@hanjaro.com" className="font-medium text-primary hover:text-primary-dark">
                고객 지원에 문의하기
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 