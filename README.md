# 개인정보 보호 낱말퀴즈 Mobile v2

## 화면 흐름
QR 접속 → 닉네임 입력 → 입장하기 → 퀴즈 → 실시간 TOP 5 → 최종 순위

## GitHub 파일
index.html
style.css
app.js
questions.js
firebase-config.js
firestore.rules
README.md

## Firebase
1. Firebase 프로젝트 생성
2. Web App 추가
3. Authentication > Sign-in method > Anonymous 활성화
4. Firestore Database 생성
5. firebase-config.js에 Web App 설정값 입력
6. firestore.rules 적용
7. GitHub Pages에 파일 업로드

## 점수
문제별 정답 순서: 1등 100점 / 2등 90점 / 3등 80점 / 4등 이후 70점

## 주의
firebaseConfig는 웹 앱 공개 설정값이지만 Firebase Admin SDK 서비스 계정 키는 절대 GitHub에 올리지 마세요.
현재 버전은 행사형 프로토타입입니다. 정답은 questions.js에 있으므로 강한 부정행위 방지가 필요하면 Cloud Functions 서버 검증으로 강화하는 것을 권장합니다.
