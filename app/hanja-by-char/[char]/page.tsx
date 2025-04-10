'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { initializeHanjaSystem, getHanjaByCharacter } from '@/utils/newHanjaUtils';
import PageContainer from '@/app/components/PageContainer';
import ContentCard from '@/app/components/ContentCard';

export default function HanjaCharRedirect() {
  const params = useParams() || {};
  const router = useRouter();
  const character = params.char ? decodeURIComponent(params.char as string) : '';

  useEffect(() => {
    async function redirectToIdBasedPage() {
      try {
        // 시스템 초기화
        await initializeHanjaSystem();
        
        // 한자 정보 로드
        const hanja = await getHanjaByCharacter(character);
        if (hanja) {
          // ID 기반 페이지로 리디렉션
          router.replace(`/hanja/${hanja.id}`);
        } else {
          // 한자를 찾지 못한 경우 에러 페이지로 이동
          router.replace('/hanja?error=character-not-found');
        }
      } catch (err) {
        console.error('Error redirecting:', err);
        // 오류 발생 시 에러 페이지로 이동
        router.replace('/hanja?error=loading-failed');
      }
    }
    
    if (character) {
      redirectToIdBasedPage();
    } else {
      // 한자가 제공되지 않은 경우
      router.replace('/hanja?error=no-character');
    }
  }, [character, router]);

  return (
    <PageContainer maxWidth="max-w-6xl">
      <ContentCard>
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3">한자 페이지로 이동 중입니다...</span>
        </div>
      </ContentCard>
    </PageContainer>
  );
} 