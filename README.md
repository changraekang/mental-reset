# 멘탈 리셋

날것의 감정을 버리고, 페르소나가 한 문장 액션 카드로 다시 잡아 주는 Vite 앱입니다.

## 실행

프론트 (`mental-reset`)

```bash
npm install
npm run dev
```

API (`donyamel-api`)

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

`donyamel-api/.env`에 `OPENAI_API_KEY`를 넣어야 리프레이밍이 동작합니다. 프론트는 `/api`를 `http://localhost:4000`으로 프록시합니다.
