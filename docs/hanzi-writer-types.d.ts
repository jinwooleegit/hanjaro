declare module 'hanzi-writer' {
  export interface HanziWriterOptions {
    width?: number;
    height?: number;
    padding?: number;
    strokeAnimationSpeed?: number;
    delayBetweenStrokes?: number;
    strokeColor?: string;
    radicalColor?: string;
    highlightColor?: string;
    outlineColor?: string;
    drawingColor?: string;
    showOutline?: boolean;
    showCharacter?: boolean;
    showHintAfterMisses?: number;
    charDataLoader?: Function;
    onLoadCharDataSuccess?: Function;
    onLoadCharDataError?: Function;
    renderer?: string;
  }

  export interface HanziWriter {
    animateCharacter: () => void;
    animateStroke: (strokeNum: number) => void;
    loopCharacterAnimation: () => void;
    pauseAnimation: () => void;
    resumeAnimation: () => void;
    cancelAnimation: () => void;
    setCharacter: (character: string) => void;
    getCharacter: () => string;
  }

  export function create(
    element: HTMLElement | string,
    character: string,
    options?: HanziWriterOptions
  ): HanziWriter;

  export default {
    create
  };
} 