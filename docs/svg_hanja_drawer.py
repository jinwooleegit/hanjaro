import json
import time
import sys
import os
import tkinter as tk
from tkinter import messagebox
import argparse
import random
import math
from PIL import Image, ImageDraw, ImageTk
import re

# SVG 경로 파서
class SVGPathParser:
    @staticmethod
    def parse_path(path_str):
        """SVG 경로 문자열을 파싱하여 명령과 좌표 리스트로 반환"""
        commands = []
        # 명령어와 좌표 추출 정규식
        pattern = r'([MLHVCSQTAZ])([^MLHVCSQTAZ]*)'
        for match in re.finditer(pattern, path_str):
            cmd = match.group(1)
            coords_str = match.group(2).strip()
            coords = [float(x) for x in coords_str.replace(',', ' ').split()]
            commands.append((cmd, coords))
        return commands

    @staticmethod
    def get_path_points(path_str, steps=50):
        """SVG 경로로부터 점들의 배열을 생성"""
        commands = SVGPathParser.parse_path(path_str)
        points = []
        current_point = (0, 0)
        
        for cmd, coords in commands:
            if cmd == 'M':  # Move to
                current_point = (coords[0], coords[1])
                points.append(current_point)
            elif cmd == 'L':  # Line to
                end_point = (coords[0], coords[1])
                # 선형 보간으로 점들 생성
                for t in range(1, steps + 1):
                    t_val = t / steps
                    x = current_point[0] * (1 - t_val) + end_point[0] * t_val
                    y = current_point[1] * (1 - t_val) + end_point[1] * t_val
                    points.append((x, y))
                current_point = end_point
            elif cmd == 'Q':  # Quadratic Bezier
                control_point = (coords[0], coords[1])
                end_point = (coords[2], coords[3])
                # 2차 베지어 곡선 계산
                for t in range(1, steps + 1):
                    t_val = t / steps
                    x = (1 - t_val)**2 * current_point[0] + 2 * (1 - t_val) * t_val * control_point[0] + t_val**2 * end_point[0]
                    y = (1 - t_val)**2 * current_point[1] + 2 * (1 - t_val) * t_val * control_point[1] + t_val**2 * end_point[1]
                    points.append((x, y))
                current_point = end_point
            elif cmd == 'C':  # Cubic Bezier
                control_point1 = (coords[0], coords[1])
                control_point2 = (coords[2], coords[3])
                end_point = (coords[4], coords[5])
                # 3차 베지어 곡선 계산
                for t in range(1, steps + 1):
                    t_val = t / steps
                    x = (1 - t_val)**3 * current_point[0] + 3 * (1 - t_val)**2 * t_val * control_point1[0] + \
                        3 * (1 - t_val) * t_val**2 * control_point2[0] + t_val**3 * end_point[0]
                    y = (1 - t_val)**3 * current_point[1] + 3 * (1 - t_val)**2 * t_val * control_point1[1] + \
                        3 * (1 - t_val) * t_val**2 * control_point2[1] + t_val**3 * end_point[1]
                    points.append((x, y))
                current_point = end_point
            
        return points

class HanjaDrawer:
    def __init__(self, width=500, height=500, scale=3):
        self.width = width
        self.height = height
        self.scale = scale
        self.root = tk.Tk()
        self.root.title("한자 획순 - SVG 표현")
        
        # 캔버스 생성
        self.canvas = tk.Canvas(self.root, width=width, height=height, bg="white")
        self.canvas.pack(fill=tk.BOTH, expand=True)
        
        # 상태 표시 레이블
        self.status_label = tk.Label(self.root, text="", font=("Arial", 12))
        self.status_label.pack(side=tk.BOTTOM, fill=tk.X)
        
        # 한자 데이터 로드
        self.hanja_data = self.load_hanja_data()
        
        # 이미지와 드로잉 컨텍스트
        self.image = Image.new("RGBA", (width, height), (255, 255, 255, 0))
        self.draw = ImageDraw.Draw(self.image)
        
        # 키보드 이벤트 바인딩
        self.root.bind("<Key>", self.on_key_press)
        
    def load_hanja_data(self):
        """한자 획순 데이터 로드"""
        try:
            with open("hanja_strokes.json", "r", encoding="utf-8") as f:
                return json.load(f)
        except FileNotFoundError:
            print("Error: hanja_strokes.json 파일을 찾을 수 없습니다.")
            sys.exit(1)
        except json.JSONDecodeError:
            print("Error: hanja_strokes.json 파일 형식이 잘못되었습니다.")
            sys.exit(1)
    
    def draw_grid(self):
        """그리드 그리기"""
        # 주요 그리드 라인
        for i in range(0, self.width + 1, 50):
            # 수직선
            self.canvas.create_line(i, 0, i, self.height, fill="#E0E0E0")
            # 수평선
            self.canvas.create_line(0, i, self.width, i, fill="#E0E0E0")
        
        # 중심선
        center_x, center_y = self.width // 2, self.height // 2
        self.canvas.create_line(center_x, 0, center_x, self.height, fill="#C0C0C0", width=1.5)
        self.canvas.create_line(0, center_y, self.width, center_y, fill="#C0C0C0", width=1.5)
    
    def draw_stroke_path(self, stroke, delay=True, color="black"):
        """한 획을 그리는 함수"""
        if "path" not in stroke:
            return
        
        path_str = stroke["path"]
        stroke_width = float(stroke.get("strokeWidth", 2.5)) * self.scale
        
        # SVG 경로를 해석하여 점들의 배열로 변환
        points = SVGPathParser.get_path_points(path_str)
        
        if not points:
            return
        
        # 획의 경로를 따라 그리기
        last_point = None
        for i, point in enumerate(points):
            # 점 좌표를 조정 (중앙 정렬)
            x, y = point[0] * self.scale, point[1] * self.scale
            
            if last_point:
                # 획의 두께를 점점 변화시켜 붓의 압력 효과 표현
                progress = i / len(points)
                thickness = stroke_width
                if progress < 0.2:  # 시작 부분
                    thickness = stroke_width * (0.5 + 2.5 * progress)
                elif progress > 0.8:  # 끝 부분
                    thickness = stroke_width * (0.5 + 2.5 * (1 - progress))
                
                # 캔버스에 선 그리기
                line_id = self.canvas.create_line(
                    last_point[0], last_point[1], x, y, 
                    fill=color, width=thickness, 
                    capstyle=tk.ROUND, joinstyle=tk.ROUND
                )
                
                if delay:
                    self.canvas.update()
                    time.sleep(0.02)  # 획 애니메이션 속도 조절
            
            last_point = (x, y)
    
    def draw_hanja(self, character, delay=True):
        """한자 그리기"""
        if character not in self.hanja_data:
            messagebox.showerror("오류", f"'{character}' 한자에 대한 데이터가 없습니다.")
            return False
        
        self.canvas.delete("all")  # 캔버스 초기화
        self.draw_grid()
        
        # 타이틀 설정
        meaning = self.hanja_data[character]["meaning"]
        self.root.title(f"한자 획순 - {character} ({meaning})")
        
        # 획순 정보 가져오기
        strokes = self.hanja_data[character]["strokes"]
        
        # 각 획을 순서대로 그리기
        for i, stroke in enumerate(strokes):
            self.status_label.config(text=f"{i+1}/{len(strokes)}획: {stroke['desc']}")
            self.draw_stroke_path(stroke, delay)
            self.root.update()
        
        # 완성 메시지
        stroke_count = self.hanja_data[character]["stroke_count"]
        self.status_label.config(text=f"{character}({meaning}) - 완성 (총 {stroke_count}획)")
        return True
    
    def list_available_hanja(self):
        """사용 가능한 한자 목록 표시"""
        hanja_list = "사용 가능한 한자:\n"
        for hanja, data in self.hanja_data.items():
            hanja_list += f"{hanja} ({data['meaning']}) - {data['stroke_count']}획\n"
        messagebox.showinfo("한자 목록", hanja_list)
    
    def on_key_press(self, event):
        """키보드 이벤트 처리"""
        key = event.char
        if key == 'q':
            self.root.quit()
        elif key == 'l':
            self.list_available_hanja()
    
    def run(self, character=None):
        """프로그램 실행"""
        if character is None:
            # 사용자 입력 받기
            available_hanja = ", ".join(self.hanja_data.keys())
            input_window = tk.Toplevel(self.root)
            input_window.title("한자 선택")
            tk.Label(input_window, text=f"표시할 한자를 입력하세요 (사용 가능: {available_hanja})").pack(pady=10)
            entry = tk.Entry(input_window)
            entry.pack(pady=10)
            
            def on_submit():
                char = entry.get()
                input_window.destroy()
                if char in self.hanja_data:
                    self.draw_hanja(char)
                else:
                    messagebox.showerror("오류", f"'{char}' 한자에 대한 데이터가 없습니다.")
                    self.list_available_hanja()
            
            tk.Button(input_window, text="확인", command=on_submit).pack(pady=10)
            entry.focus_set()
            entry.bind("<Return>", lambda event: on_submit())
        else:
            self.draw_hanja(character)
        
        # 메인 루프 실행
        self.root.mainloop()

def main():
    parser = argparse.ArgumentParser(description="한자 획순 시각화 (SVG 패스 적용)")
    parser.add_argument("character", nargs="?", help="표시할 한자 (예: 永, 雨, 火)")
    parser.add_argument("--width", type=int, default=500, help="화면 너비")
    parser.add_argument("--height", type=int, default=500, help="화면 높이")
    parser.add_argument("--scale", type=float, default=3.0, help="획 크기 배율")
    parser.add_argument("--nodelay", action="store_true", help="획 에니메이션 없음")
    
    args = parser.parse_args()
    
    drawer = HanjaDrawer(width=args.width, height=args.height, scale=args.scale)
    drawer.run(args.character)

if __name__ == "__main__":
    main() 