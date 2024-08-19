# Node.js 버전 18이 설치된 alpine Linux를 기반 이미지로 사용
FROM node:18-alpine

# Docker 컨테이너 내에서 작업할 디렉토리를 /web으로 설정
WORKDIR /web

# 빌드된 결과물 복사
COPY . .

# 컨테이너의 80 포트를 외부에 노출. 애플리케이션이 해당 포트에서 실행될 것임을 나타냄
EXPOSE 80

# 컨테이너가 실행되면 npm start를 실행
CMD ["npm", "start"]