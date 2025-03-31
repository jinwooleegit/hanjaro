import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';

// 임시 사용자 데이터 저장소 (실제로는 데이터베이스 사용)
// [...nextauth].ts 파일에서도 사용할 수 있도록 전역적으로 정의
// 실제 애플리케이션에서는 데이터베이스에서 사용자 데이터를 관리해야 합니다.
export const users: any[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST 메소드만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않은 메소드입니다.' });
  }

  try {
    const { name, email, password } = req.body;

    // 필수 필드 검증
    if (!name || !email || !password) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: '유효한 이메일 주소를 입력해주세요.' });
    }

    // 비밀번호 길이 검증
    if (password.length < 8) {
      return res.status(400).json({ message: '비밀번호는 8자 이상이어야 합니다.' });
    }

    // 이메일 중복 검사
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await hash(password, 10);

    // 새 사용자 생성
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
      createdAt: new Date(),
    };

    // 임시 데이터 저장소에 추가
    users.push(newUser);

    // 성공 응답 (비밀번호 필드는 제외)
    const { password: _, ...userWithoutPassword } = newUser;
    
    console.log('새 사용자 등록:', userWithoutPassword);
    
    return res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
} 