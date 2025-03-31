import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import KakaoProvider from 'next-auth/providers/kakao';
import { compare, hash } from 'bcryptjs';
import { users } from './register';

// 테스트용 기본 사용자 추가 (개발 환경에서만)
if (process.env.NODE_ENV === 'development' && users.length === 0) {
  console.log('테스트 사용자를 생성합니다.');
  // 비밀번호: password123
  // 새 해시 생성 (이전 해시 값과 다름)
  const createTestUser = async () => {
    const hashedPassword = await hash('password123', 10);
    users.push({
      id: '1',
      name: '테스트 사용자',
      email: 'test@example.com',
      password: hashedPassword,
      image: 'https://ui-avatars.com/api/?name=테스트+사용자&background=random&color=fff',
      createdAt: new Date(),
    });
    console.log('사용자 목록:', users.map(u => ({ id: u.id, email: u.email, name: u.name })));
  };
  
  createTestUser();
}

// 환경 변수에서 URL 가져오기 또는 기본값 설정
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3001';
console.log(`NextAuth URL: ${NEXTAUTH_URL}`);

export default NextAuth({
  // 여러 인증 제공자 설정
  providers: [
    // 자격 증명 프로바이더 (이메일/비밀번호)
    CredentialsProvider({
      name: '이메일/비밀번호',
      credentials: {
        email: { label: '이메일', type: 'email', placeholder: 'email@example.com' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('로그인 시도:', credentials?.email);
          
          // 사용자 확인
          const user = users.find(user => user.email === credentials?.email);

          if (!user) {
            console.log('사용자를 찾을 수 없음:', credentials?.email);
            return null;
          }

          if (!credentials?.password) {
            console.log('비밀번호가 제공되지 않음');
            return null;
          }

          // 비밀번호 확인
          const isPasswordValid = await compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            console.log('비밀번호가 일치하지 않음');
            return null;
          }

          console.log('로그인 성공:', { id: user.id, name: user.name, email: user.email });
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error('로그인 과정에서 오류 발생:', error);
          return null;
        }
      },
    }),
    
    // OAuth 제공자 설정 - 클라이언트 ID와 Secret을 설정한 후 주석 해제
    /* 
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
    */
  ],
  
  // 세션 설정
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  
  // JWT 설정
  secret: process.env.NEXTAUTH_SECRET,
  
  // 페이지 설정
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    newUser: '/auth/register',
  },
  
  // 콜백 설정
  callbacks: {
    async jwt({ token, user, account }) {
      // 사용자 객체가 있는 경우 토큰에 사용자 정보 추가
      if (user) {
        token.id = user.id;
      }
      
      // OAuth 공급자에서 추가 정보 토큰에 저장
      if (account) {
        token.provider = account.provider;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // 세션에 사용자 ID 추가
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  
  // 추가 설정
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  },
  
  // 디버그 모드 (개발 중에는 켜두고, 프로덕션에서는 꺼야 함)
  debug: process.env.NODE_ENV === 'development',
}); 