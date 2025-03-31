/**
 * NextAuth 설정 도우미 스크립트
 * 
 * 이 스크립트는 NextAuth.js 설정을 도와주는 간단한 유틸리티입니다.
 * 실행 방법: node setup-auth.js
 */

const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 환경 변수 파일 경로
const ENV_FILE = '.env.local';

// 새로운 시크릿 키 생성
function generateSecret() {
  return crypto.randomBytes(32).toString('hex');
}

// 현재 환경 변수 읽기
function readEnvFile() {
  try {
    if (fs.existsSync(ENV_FILE)) {
      return fs.readFileSync(ENV_FILE, 'utf8');
    }
    return '';
  } catch (error) {
    console.error('환경 변수 파일을 읽는 중 오류가 발생했습니다:', error);
    return '';
  }
}

// 환경 변수 파일 업데이트
function updateEnvFile(content) {
  try {
    fs.writeFileSync(ENV_FILE, content);
    console.log(`${ENV_FILE} 파일이 업데이트되었습니다.`);
  } catch (error) {
    console.error('환경 변수 파일을 쓰는 중 오류가 발생했습니다:', error);
  }
}

// 환경 변수 설정
function setupEnvVariables() {
  const envContent = readEnvFile();
  let newEnvContent = '';
  
  // 이미 내용이 있는 경우 환경 변수 파싱
  const envVars = {};
  if (envContent) {
    envContent.split('\n').forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value !== undefined) {
          envVars[key.trim()] = value.trim();
        }
      }
    });
  }
  
  // NEXTAUTH_SECRET 설정 (없거나 더미 값인 경우)
  if (!envVars.NEXTAUTH_SECRET || envVars.NEXTAUTH_SECRET === 'your_nextauth_secret_key_here') {
    envVars.NEXTAUTH_SECRET = generateSecret();
    console.log('새로운 NEXTAUTH_SECRET이 생성되었습니다.');
  }
  
  // NEXTAUTH_URL 설정 (없는 경우)
  if (!envVars.NEXTAUTH_URL) {
    envVars.NEXTAUTH_URL = 'http://localhost:3000';
    console.log('NEXTAUTH_URL이 http://localhost:3000으로 설정되었습니다.');
  }
  
  // 환경 변수 파일 내용 구성
  newEnvContent += '# Authentication\n';
  newEnvContent += `NEXTAUTH_URL=${envVars.NEXTAUTH_URL}\n`;
  newEnvContent += `NEXTAUTH_SECRET=${envVars.NEXTAUTH_SECRET}\n\n`;
  
  newEnvContent += '# OAuth Providers\n';
  newEnvContent += '# 아래 값들은 각 서비스의 개발자 콘솔에서 받은 실제 ID와 Secret으로 교체해야 합니다\n';
  newEnvContent += `GOOGLE_CLIENT_ID=${envVars.GOOGLE_CLIENT_ID || ''}\n`;
  newEnvContent += `GOOGLE_CLIENT_SECRET=${envVars.GOOGLE_CLIENT_SECRET || ''}\n\n`;
  
  newEnvContent += `GITHUB_CLIENT_ID=${envVars.GITHUB_CLIENT_ID || ''}\n`;
  newEnvContent += `GITHUB_CLIENT_SECRET=${envVars.GITHUB_CLIENT_SECRET || ''}\n\n`;
  
  newEnvContent += `KAKAO_CLIENT_ID=${envVars.KAKAO_CLIENT_ID || ''}\n`;
  newEnvContent += `KAKAO_CLIENT_SECRET=${envVars.KAKAO_CLIENT_SECRET || ''}\n`;
  
  // 파일 업데이트
  updateEnvFile(newEnvContent);
}

// Google OAuth 설정 안내
function showGoogleOAuthInstructions() {
  console.log('\n===== Google OAuth 설정 가이드 =====');
  console.log('1. https://console.cloud.google.com/ 에 로그인합니다.');
  console.log('2. 프로젝트를 선택하거나 새 프로젝트를 생성합니다.');
  console.log('3. "API 및 서비스" > "사용자 인증 정보"로 이동합니다.');
  console.log('4. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID"를 클릭합니다.');
  console.log('5. 애플리케이션 유형으로 "웹 애플리케이션"을 선택합니다.');
  console.log('6. "승인된 자바스크립트 원본"에 http://localhost:3000 을 추가합니다.');
  console.log('7. "승인된 리디렉션 URI"에 http://localhost:3000/api/auth/callback/google 을 추가합니다.');
  console.log('8. "만들기"를 클릭하여 클라이언트 ID와 시크릿을 생성합니다.');
  console.log('9. 생성된 클라이언트 ID와 시크릿을 .env.local 파일에 추가합니다.');
  console.log('===================================\n');
}

// 메인 함수
function main() {
  console.log('NextAuth 설정 도우미를 시작합니다...');
  
  // 환경 변수 설정
  setupEnvVariables();
  
  // Google OAuth 설정 안내
  showGoogleOAuthInstructions();
  
  // 종료
  console.log('설정이 완료되었습니다. npm run dev로 애플리케이션을 실행해보세요.');
  rl.close();
}

// 실행
main(); 