# 한자로 아이콘 생성 가이드

## GPT를 활용한 CSS 스프라이트용 아이콘 생성 방법

### CSS 스프라이트란?
CSS 스프라이트는 여러 개의 이미지를 하나의 큰 이미지로 통합하여 HTTP 요청을 줄이고 성능을 개선하는 기술입니다. 이를 통해 로딩 속도를 향상시키고 서버 부하를 줄일 수 있습니다.

### GPT를 이용한 이미지 생성 프롬프트

다음은 DALL-E와 같은 이미지 생성 모델을 활용하여 CSS 스프라이트용 이미지를 생성하는 프롬프트 예시입니다:

```
I need a CSS sprite sheet containing 8 Korean hanja (Chinese character) icons arranged in a 4x2 grid. Each icon should be a square with the following specifications:

1. All icons should have consistent size and style
2. Each icon should feature a single hanja character in the center
3. Use simple, flat design with gradient backgrounds
4. Characters should be: 人, 山, 水, 火, 木, 金, 土, 日
5. Use a distinct color for each character background:
   - 人 (person): blue gradient
   - 山 (mountain): green gradient
   - 水 (water): light blue gradient
   - 火 (fire): red gradient
   - 木 (tree): brown gradient
   - 金 (gold/metal): yellow gradient
   - 土 (earth): orange gradient
   - 日 (sun/day): yellow-orange gradient
6. The characters should be white or black (whichever provides better contrast)
7. Include subtle rounded corners for each icon cell
8. Add a thin, light border around each icon
9. Ensure there are no gaps between icons so they can be precisely extracted with CSS

The final image should be 800x400 pixels (with each icon being 200x200 pixels) and should be suitable for web use. Please ensure the image has a transparent background and clean edges for each icon division.
```

### CSS로 스프라이트 사용하기

아래는 생성된 스프라이트 이미지를 CSS로 활용하는 기본 예시입니다:

```css
.hanja-icon {
  width: 50px;
  height: 50px;
  background-image: url('/images/hanja-sprite.png');
  background-repeat: no-repeat;
  display: inline-block;
}

/* 각 한자 아이콘의 위치 지정 */
.icon-person { background-position: 0 0; }
.icon-mountain { background-position: -50px 0; }
.icon-water { background-position: -100px 0; }
.icon-fire { background-position: -150px 0; }
.icon-tree { background-position: 0 -50px; }
.icon-metal { background-position: -50px -50px; }
.icon-earth { background-position: -100px -50px; }
.icon-sun { background-position: -150px -50px; }
```

### HTML 사용 예시:

```html
<div>
  <span class="hanja-icon icon-person" title="인(人)"></span>
  <span class="hanja-icon icon-mountain" title="산(山)"></span>
  <span class="hanja-icon icon-water" title="수(水)"></span>
</div>
```

### 배지/레벨 아이콘 생성 프롬프트

학습 레벨 배지용 아이콘을 생성하기 위한 프롬프트 예시:

```
I need a CSS sprite sheet containing 15 badge icons for a Korean Hanja learning app, arranged in a 5x3 grid. Each badge represents a level of achievement (1급 through 15급).

1. All badges should have a circular design with consistent size
2. Each badge should display its level number (1-15) prominently
3. Use a color gradient that progresses through levels:
   - Levels 1-3: Gold/Premium badges (Highest achievement)
   - Levels 4-6: Red/Purple badges (Advanced)
   - Levels 7-9: Blue badges (Intermediate)
   - Levels 10-12: Green badges (Basic-Intermediate)
   - Levels 13-15: Bronze/Starter badges (Beginner)
4. Include decorative elements that become more elaborate with higher levels
5. Add a subtle glow effect to higher-level badges
6. Include the Korean text "급" (level) below or next to each number
7. Ensure there are no gaps between badges so they can be precisely extracted with CSS

The final image should be 750x450 pixels (with each badge being 150x150 pixels) and should be suitable for web use. Please ensure the image has a transparent background and clean edges for each badge division.
```

### 추가 팁:
- 이미지 생성 시 더 세부적인 가이드라인과 피드백을 제공할수록 더 좋은 결과를 얻을 수 있습니다.
- 스프라이트 이미지가 생성된 후 이미지 편집 툴을 사용하여 조정이 필요할 수 있습니다.
- 반응형 디자인을 위해서는 SVG 스프라이트 방식도 고려해 볼 수 있습니다. 