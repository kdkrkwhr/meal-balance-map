# 화면 우선 프로토타입

## 구현 범위
- 식사 탐색: 검색, 복수 조건(AND), 예산·지역·가격순 정렬
- 가상 지도 핀과 선택 메뉴 카드 연동, 확대·축소, 모바일 지도/목록 전환
- 메뉴 저장(현재 탭 메모리만), 상세 영양 예시, 추천 근거, 관계 지도
- AI 추천 UX: 제한된 키워드를 로컬에서 읽는 **규칙 기반 모의 동작**

식당·메뉴·가격·지도 위치·영양 수치는 모두 가상이다. 실제 지도, 잇플, 식약처, LLM, Wiki/Graphify API는 연결하지 않았다. 영양 점수나 정확한 1인분 계산을 제공하지 않는다. 질환·알레르기 적합성을 판단하지 않는다.

## 실행 및 검증
index.html을 브라우저로 열거나 npm start 후 http://localhost:4173 에서 확인한다.
런타임 의존성, 키, 서버, 외부 폰트·이미지·API 호출이 없다.

개발 테스트: npm ci && npm test
Chromium 테스트: pip install playwright==1.51.0 후 python -m playwright install chromium && python tests/browser_smoke.py

단위/DOM 테스트는 브라우저 렌더링 검증을 대신하지 않는다. 브라우저 테스트는 데스크톱/모바일 폭, 가로 넘침, 검색, 상세, Escape, 지도 선택 및 JS 오류를 확인하고 스크린샷을 남긴다.

## GitHub Pages
.github/workflows/pages.yml은 테스트 후 index.html과 app/만 게시한다.
최초 설정은 저장소 Settings → Pages → Source를 GitHub Actions로 지정해야 한다.
공개 저장소의 무료 Pages/Actions 범위 사용을 전제로 하며, 실제 API 운영비 무료를 보장하는 구성이 아니다.
예정 주소: https://kdkrkwhr.github.io/meal-balance-map/

## 다음 단계
화면 피드백 이후 실제 메뉴 데이터 확보·사용권·기준량을 먼저 검증한다. 이후 지도 제공자, 고정 IP가 필요한 연동 위치, 영양 근거 추적, 접근성을 단계적으로 연결한다. 기존 docs의 기획·정책은 변경하지 않는다.
