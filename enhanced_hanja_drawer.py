#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import time
import sys
import os
import turtle
from turtle import Screen, Turtle
import argparse
import random

# 한자 획순 데이터 로드
def load_hanja_data(file_path='hanja_strokes.json'):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: '{file_path}' 파일을 찾을 수 없습니다.")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: '{file_path}' 파일의 JSON 형식이 올바르지 않습니다.")
        sys.exit(1)

# 곡선으로 한자 획 그리기 (자연스러운 느낌의 붓 효과)
def draw_stroke_curve(t, x1, y1, x2, y2, steps=20):
    # 시작점으로 이동
    t.penup()
    t.goto(x1, y1)
    t.pendown()
    
    # 획의 방향 결정
    dx = x2 - x1
    dy = y2 - y1
    
    # 획의 길이
    length = ((dx)**2 + (dy)**2)**0.5
    
    # 붓의 압력 효과 (시작과 끝은 더 얇게, 중간은 더 굵게)
    original_size = t.pensize()
    
    for i in range(steps + 1):
        # 현재 위치 계산
        t = i / steps
        
        # 약간의 곡선 효과 추가 (길이가 긴 획에만)
        if length > 30:
            curve_factor = 0.1 * length
            curve_x = 0
            curve_y = curve_factor * (t - 0.5)**2 * (-1 if abs(dx) > abs(dy) else 1)
            
            if abs(dx) > abs(dy):  # 가로 방향 획
                curve_y = curve_factor * (t - 0.5)**2 * (-1)
            else:  # 세로 방향 획
                curve_x = curve_factor * (t - 0.5)**2 * (-1 if dy > 0 else 1)
        else:
            curve_x = 0
            curve_y = 0
        
        # 압력 효과 (붓의 굵기 변화)
        pressure = 1 - 0.7 * (2*t - 1)**2  # 중간에 최대 압력
        t.pensize(original_size * pressure)
        
        # 다음 점으로 이동
        next_x = x1 + dx * t + curve_x
        next_y = y1 + dy * t + curve_y
        t.goto(next_x, next_y)
    
    # 펜 크기 복원
    t.pensize(original_size)

# 한자 그리기 함수 (향상된 버전)
def draw_hanja_enhanced(hanja_char, hanja_data, delay=0.5, pen_size=5, grid=True, 
                        curve=True, show_stroke_order=True, bg_color="white", pen_color="black"):
    if hanja_char not in hanja_data:
        print(f"Error: '{hanja_char}' 한자의 데이터가 없습니다.")
        print(f"사용 가능한 한자: {', '.join(hanja_data.keys())}")
        return

    # 화면 설정
    screen = Screen()
    screen.title(f"한자 획순 - {hanja_char} ({hanja_data[hanja_char]['meaning']})")
    screen.setup(500, 500)
    screen.bgcolor(bg_color)
    
    # 스크린 트래커 비활성화 (더 빠른 그리기)
    screen.tracer(0)

    # 그리드 그리기 (옵션)
    if grid:
        grid_drawer = Turtle()
        grid_drawer.hideturtle()
        grid_drawer.speed(0)
        grid_drawer.pencolor("lightgray")
        grid_drawer.pensize(1)
        
        # 세로선
        for x in range(-100, 101, 20):
            grid_drawer.penup()
            grid_drawer.goto(x, -100)
            grid_drawer.pendown()
            grid_drawer.goto(x, 100)
        
        # 가로선
        for y in range(-100, 101, 20):
            grid_drawer.penup()
            grid_drawer.goto(-100, y)
            grid_drawer.pendown()
            grid_drawer.goto(100, y)

    # 한자 테두리 그리기
    border = Turtle()
    border.hideturtle()
    border.speed(0)
    border.pencolor("gray")
    border.pensize(2)
    border.penup()
    border.goto(-100, -100)
    border.pendown()
    for _ in range(4):
        border.forward(200)
        border.left(90)

    # 획순 번호 표시 준비
    number_turtles = []
    if show_stroke_order:
        for _ in range(hanja_data[hanja_char]['stroke_count']):
            num_turtle = Turtle()
            num_turtle.hideturtle()
            num_turtle.penup()
            num_turtle.color("red")
            number_turtles.append(num_turtle)

    # 획순 정보 표시
    info = Turtle()
    info.hideturtle()
    info.speed(0)
    info.penup()
    info.goto(0, -150)
    info.color("blue")
    info.write(f"{hanja_char} ({hanja_data[hanja_char]['meaning']}) - 총 {hanja_data[hanja_char]['stroke_count']}획", 
              align="center", font=("Arial", 12, "bold"))

    # 획 그리기 준비
    t = Turtle()
    t.hideturtle()
    t.speed(0)  # 최대 속도
    t.pensize(pen_size)
    t.pencolor(pen_color)

    # 스크린 업데이트 함수
    def update_screen():
        screen.update()
        screen.ontimer(lambda: None, int(delay * 1000))  # 지연 설정

    # 획순대로 그리기
    strokes = hanja_data[hanja_char]['strokes']
    for i, stroke in enumerate(strokes, 1):
        # 획 정보 표시
        info.clear()
        info.write(f"{hanja_char} ({hanja_data[hanja_char]['meaning']}) - {i}/{hanja_data[hanja_char]['stroke_count']}획: {stroke['desc']}", 
                  align="center", font=("Arial", 12, "bold"))
        
        # 좌표 변환
        x1, y1 = stroke['x1'] - 100, 100 - stroke['y1']
        x2, y2 = stroke['x2'] - 100, 100 - stroke['y2']
        
        # 획 그리기 (곡선 또는 직선)
        if curve:
            draw_stroke_curve(t, x1, y1, x2, y2)
        else:
            t.penup()
            t.goto(x1, y1)
            t.pendown()
            t.goto(x2, y2)
        
        # 획 번호 표시
        if show_stroke_order:
            # 획의 중간 위치에 번호 표시
            num_turtle = number_turtles[i-1]
            mid_x = (x1 + x2) / 2
            mid_y = (y1 + y2) / 2
            num_turtle.goto(mid_x, mid_y)
            num_turtle.write(str(i), align="center", font=("Arial", 8, "bold"))
        
        # 화면 업데이트
        update_screen()
        time.sleep(delay)

    # 최종 정보 표시
    info.clear()
    info.write(f"{hanja_char} ({hanja_data[hanja_char]['meaning']}) - 완성 (총 {hanja_data[hanja_char]['stroke_count']}획)", 
              align="center", font=("Arial", 12, "bold"))

    # 추가 정보 메시지
    info.goto(0, -170)
    info.color("darkgreen")
    info.write("클릭하여 종료하세요", align="center", font=("Arial", 10, "normal"))
    
    # 마지막 화면 업데이트
    screen.update()
    screen.exitonclick()

# 연습 모드: 한자를 여러 번 반복해서 그리기
def practice_mode(hanja_char, hanja_data, repetitions=3, delay=0.3):
    print(f"'{hanja_char}' 연습 모드를 시작합니다. {repetitions}회 반복합니다.")
    for i in range(repetitions):
        print(f"연습 {i+1}/{repetitions}...")
        draw_hanja_enhanced(hanja_char, hanja_data, delay=delay, curve=True)

# 퀴즈 모드: 무작위 한자 선택 후 획순 맞추기
def quiz_mode(hanja_data, num_questions=3):
    print(f"한자 획순 퀴즈 모드를 시작합니다. 총 {num_questions}문제입니다.")
    score = 0
    
    # 한자 목록에서 무작위 선택
    hanja_list = list(hanja_data.keys())
    quiz_items = random.sample(hanja_list, min(num_questions, len(hanja_list)))
    
    for i, hanja_char in enumerate(quiz_items, 1):
        print(f"\n문제 {i}/{num_questions}: {hanja_char} ({hanja_data[hanja_char]['meaning']})")
        correct_count = hanja_data[hanja_char]['stroke_count']
        
        try:
            user_answer = int(input(f"이 한자의 총 획수는 몇 획인가요? "))
            if user_answer == correct_count:
                print("정답입니다! 획순을 보여드립니다.")
                score += 1
            else:
                print(f"틀렸습니다. 정답은 {correct_count}획입니다. 획순을 보여드립니다.")
            
            # 획순 보여주기
            draw_hanja_enhanced(hanja_char, hanja_data, delay=0.5)
            
        except ValueError:
            print("숫자를 입력해주세요.")
            print(f"정답은 {correct_count}획입니다. 획순을 보여드립니다.")
            draw_hanja_enhanced(hanja_char, hanja_data, delay=0.5)
    
    print(f"\n퀴즈 결과: {num_questions}문제 중 {score}문제 정답")
    print(f"정답률: {score/num_questions*100:.1f}%")

# 사용 가능한 한자 목록 출력
def list_available_hanja(hanja_data):
    print("\n사용 가능한 한자:")
    for char, data in hanja_data.items():
        print(f"  {char} - {data['meaning']} ({data['stroke_count']}획)")

# 메인 함수
def main():
    # 명령줄 인자 파싱
    parser = argparse.ArgumentParser(description='한자 획순 학습 프로그램')
    parser.add_argument('hanja', nargs='?', help='표시할 한자 (예: 永)')
    parser.add_argument('--data', '-d', default='hanja_strokes.json', help='한자 데이터 파일 경로')
    parser.add_argument('--practice', '-p', action='store_true', help='연습 모드 활성화')
    parser.add_argument('--quiz', '-q', action='store_true', help='퀴즈 모드 활성화')
    parser.add_argument('--count', '-c', type=int, default=3, help='연습 횟수 또는 퀴즈 문제 수')
    parser.add_argument('--delay', type=float, default=0.5, help='획 사이의 지연 시간 (초)')
    parser.add_argument('--dark', action='store_true', help='다크 모드 활성화')
    
    args = parser.parse_args()
    
    # 한자 데이터 로드
    hanja_data = load_hanja_data(args.data)
    
    # 화면 스타일 설정
    bg_color = "black" if args.dark else "white"
    pen_color = "white" if args.dark else "black"
    
    # 모드 선택 및 실행
    if args.quiz:
        # 퀴즈 모드
        quiz_mode(hanja_data, args.count)
    elif args.practice and args.hanja:
        # 연습 모드
        if args.hanja in hanja_data:
            practice_mode(args.hanja, hanja_data, args.count, args.delay)
        else:
            print(f"Error: '{args.hanja}' 한자의 데이터가 없습니다.")
            list_available_hanja(hanja_data)
    elif args.hanja:
        # 단일 한자 표시 모드
        if args.hanja in hanja_data:
            draw_hanja_enhanced(args.hanja, hanja_data, delay=args.delay, 
                              bg_color=bg_color, pen_color=pen_color)
        else:
            print(f"Error: '{args.hanja}' 한자의 데이터가 없습니다.")
            list_available_hanja(hanja_data)
    else:
        # 인터랙티브 모드
        print("한자 획순 학습 프로그램에 오신 것을 환영합니다!")
        list_available_hanja(hanja_data)
        
        # 모드 선택
        print("\n모드를 선택하세요:")
        print("1. 한자 획순 보기")
        print("2. 연습 모드")
        print("3. 퀴즈 모드")
        
        try:
            mode = int(input("\n선택 (1-3): "))
            
            if mode == 1:
                # 한자 선택
                while True:
                    hanja_char = input("\n그릴 한자를 입력하세요 (종료: q): ")
                    if hanja_char.lower() == 'q':
                        break
                    elif hanja_char in hanja_data:
                        draw_hanja_enhanced(hanja_char, hanja_data, delay=args.delay,
                                          bg_color=bg_color, pen_color=pen_color)
                    else:
                        print(f"Error: '{hanja_char}' 한자의 데이터가 없습니다.")
            
            elif mode == 2:
                # 연습 모드
                hanja_char = input("\n연습할 한자를 입력하세요: ")
                if hanja_char in hanja_data:
                    try:
                        count = int(input("반복 횟수를 입력하세요 (기본값: 3): ") or "3")
                        practice_mode(hanja_char, hanja_data, count, args.delay)
                    except ValueError:
                        print("유효한 숫자를 입력해주세요. 기본값 3으로 설정합니다.")
                        practice_mode(hanja_char, hanja_data, 3, args.delay)
                else:
                    print(f"Error: '{hanja_char}' 한자의 데이터가 없습니다.")
            
            elif mode == 3:
                # 퀴즈 모드
                try:
                    count = int(input("문제 수를 입력하세요 (기본값: 3): ") or "3")
                    quiz_mode(hanja_data, count)
                except ValueError:
                    print("유효한 숫자를 입력해주세요. 기본값 3으로 설정합니다.")
                    quiz_mode(hanja_data, 3)
            
            else:
                print("잘못된 선택입니다. 프로그램을 종료합니다.")
        
        except ValueError:
            print("숫자를 입력해주세요. 프로그램을 종료합니다.")

# 프로그램 시작
if __name__ == "__main__":
    main() 