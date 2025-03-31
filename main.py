#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import time
import sys
import os
import turtle
from turtle import Screen, Turtle

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

# 한자 그리기 함수
def draw_hanja(hanja_char, hanja_data, delay=0.5, pen_size=5, grid=True):
    if hanja_char not in hanja_data:
        print(f"Error: '{hanja_char}' 한자의 데이터가 없습니다.")
        print(f"사용 가능한 한자: {', '.join(hanja_data.keys())}")
        return

    # 화면 설정
    screen = Screen()
    screen.title(f"한자 획순 - {hanja_char} ({hanja_data[hanja_char]['meaning']})")
    screen.setup(400, 400)
    screen.bgcolor("white")

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
    border.pencolor("black")
    border.pensize(2)
    border.penup()
    border.goto(-100, -100)
    border.pendown()
    for _ in range(4):
        border.forward(200)
        border.left(90)

    # 획순 정보 표시
    info = Turtle()
    info.hideturtle()
    info.speed(0)
    info.penup()
    info.goto(0, -140)
    info.write(f"{hanja_char} ({hanja_data[hanja_char]['meaning']}) - 총 {hanja_data[hanja_char]['stroke_count']}획", 
              align="center", font=("Arial", 12, "bold"))

    # 획 그리기 준비
    t = Turtle()
    t.hideturtle()
    t.speed(6)  # 적당한 속도
    t.pensize(pen_size)
    t.pencolor("black")

    # 획순대로 그리기
    strokes = hanja_data[hanja_char]['strokes']
    for i, stroke in enumerate(strokes, 1):
        # 획 정보 표시
        info.clear()
        info.write(f"{hanja_char} ({hanja_data[hanja_char]['meaning']}) - {i}/{hanja_data[hanja_char]['stroke_count']}획: {stroke['desc']}", 
                  align="center", font=("Arial", 12, "bold"))
        
        # 획 그리기
        t.penup()
        t.goto(stroke['x1'] - 100, 100 - stroke['y1'])  # 좌표계 변환
        t.pendown()
        t.goto(stroke['x2'] - 100, 100 - stroke['y2'])  # 좌표계 변환
        
        # 각 획을 그린 후 지연
        time.sleep(delay)

    # 최종 정보 표시
    info.clear()
    info.write(f"{hanja_char} ({hanja_data[hanja_char]['meaning']}) - 완성 (총 {hanja_data[hanja_char]['stroke_count']}획)", 
              align="center", font=("Arial", 12, "bold"))

    # 클릭 시 종료 메시지
    info.goto(0, -160)
    info.write("클릭하여 종료하세요", align="center", font=("Arial", 10, "normal"))
    
    screen.exitonclick()

# 사용 가능한 한자 목록 출력
def list_available_hanja(hanja_data):
    print("사용 가능한 한자:")
    for char, data in hanja_data.items():
        print(f"  {char} - {data['meaning']} ({data['stroke_count']}획)")

def main():
    # 한자 데이터 로드
    hanja_data = load_hanja_data()
    
    # 명령줄 인자 확인
    if len(sys.argv) > 1:
        hanja_char = sys.argv[1]
        if hanja_char in hanja_data:
            draw_hanja(hanja_char, hanja_data)
        else:
            print(f"Error: '{hanja_char}' 한자의 데이터가 없습니다.")
            list_available_hanja(hanja_data)
    else:
        # 인자가 없으면 사용 가능한 한자 목록 출력 후 선택 받기
        list_available_hanja(hanja_data)
        while True:
            hanja_char = input("\n그릴 한자를 입력하세요 (종료: q): ")
            if hanja_char.lower() == 'q':
                break
            elif hanja_char in hanja_data:
                draw_hanja(hanja_char, hanja_data)
            else:
                print(f"Error: '{hanja_char}' 한자의 데이터가 없습니다.")

if __name__ == "__main__":
    main() 