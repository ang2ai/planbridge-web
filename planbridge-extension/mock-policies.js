// mock-policies.js — PlanBridge 목업 정책 데이터
// pbId(data-pb-id) 기준으로 해당 컴포넌트의 정책 정보를 조회

const MOCK_POLICY_MAP = {
  // ── 글로벌 정책 (페이지 루트) ──
  "SamplePage": [
    {
      policyId: "POL-G001",
      policyType: "UI_SPEC",
      scope: "GLOBAL",
      title: "공통 금액 표시 규칙",
      content: "모든 금액은 천단위 콤마 + '원' 접미사로 표시. 소수점 버림.",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-01-15",
      version: 2,
    },
    {
      policyId: "POL-G002",
      policyType: "INTERACTION",
      scope: "GLOBAL",
      title: "공통 삭제 확인 규칙",
      content: "삭제 동작 수행 전 반드시 확인 모달을 선행 표시해야 함. '정말 삭제하시겠습니까?' 문구 포함.",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-01-15",
      version: 1,
    },
    {
      policyId: "POL-G003",
      policyType: "PERMISSION",
      scope: "GLOBAL",
      title: "관리자 권한 등급",
      content: "일반 관리자: 조회/등록만 허용. 슈퍼관리자: CRUD 전체 허용. 상품삭제는 슈퍼관리자만 가능.",
      approvedBy: "이상훈 (CTO)",
      approvedAt: "2026-01-10",
      version: 1,
    },
  ],

  // ── 검색 영역 ──
  "SamplePage.SearchForm": [
    {
      policyId: "POL-SF001",
      policyType: "UI_SPEC",
      scope: "COMPONENT",
      title: "검색 폼 레이아웃",
      content: "검색 조건은 최대 2행 배치. 첫 행: 상품명, 카테고리, 상태. 두번째 행: 가격범위, 판매자, 날짜.",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-02-01",
      version: 1,
    },
  ],

  "SamplePage.SearchForm.ProductNameInput": [
    {
      policyId: "POL-SN001",
      policyType: "VALIDATION",
      scope: "ELEMENT",
      title: "상품명 검색 입력 규칙",
      content: "최소 2자 이상 입력 필요. 특수문자 <, >, \", ' 입력 불가 (XSS 방지). 입력 후 Enter 또는 검색 버튼으로 동작.",
      tableMapping: "PB_PRODUCT.PRODUCT_NAME",
      approvedBy: "김민수 (개발)",
      approvedAt: "2026-02-05",
      version: 2,
    },
  ],

  "SamplePage.SearchForm.CategorySelect": [
    {
      policyId: "POL-SC001",
      policyType: "DATA_SPEC",
      scope: "ELEMENT",
      title: "카테고리 조회 API",
      content: "카테고리 목록은 서버에서 트리 구조로 제공. 1차 선택 시 2차 카테고리 동적 로드.",
      tableMapping: "PB_CATEGORY.CATEGORY_ID, PB_CATEGORY.PARENT_ID",
      apiSpec: "GET /api/categories?parentId={id}",
      approvedBy: "이서연 (백엔드)",
      approvedAt: "2026-02-10",
      version: 1,
    },
  ],

  "SamplePage.SearchForm.StatusSelect": [
    {
      policyId: "POL-SS001",
      policyType: "BIZ_RULE",
      scope: "ELEMENT",
      title: "상태 필터 비즈니스 규칙",
      content: "DELETED 상태는 슈퍼관리자만 검색 가능. 일반 관리자에게는 '삭제' 옵션이 표시되지 않아야 함.",
      tableMapping: "PB_PRODUCT.STATUS",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-02-15",
      version: 1,
    },
  ],

  "SamplePage.SearchForm.PriceRange": [
    {
      policyId: "POL-SP001",
      policyType: "VALIDATION",
      scope: "ELEMENT",
      title: "가격 범위 검증",
      content: "최소가격은 0 이상, 최대가격은 100,000,000 이하. 최소 > 최대일 경우 경고 표시. 10원 단위만 입력 가능.",
      tableMapping: "PB_PRODUCT.PRICE",
      approvedBy: "김민수 (개발)",
      approvedAt: "2026-02-05",
      version: 1,
    },
  ],

  "SamplePage.SearchForm.SellerInput": [
    {
      policyId: "POL-SV001",
      policyType: "DATA_SPEC",
      scope: "ELEMENT",
      title: "판매자 검색 API",
      content: "판매자명 자동완성 지원. 입력 멈춘 후 300ms 뒤 API 호출. 최대 10건 추천 표시.",
      tableMapping: "PB_SELLER.SELLER_NAME",
      apiSpec: "GET /api/sellers/autocomplete?q={keyword}&limit=10",
      approvedBy: "이서연 (백엔드)",
      approvedAt: "2026-02-20",
      version: 1,
    },
  ],

  "SamplePage.SearchForm.DateRange": [
    {
      policyId: "POL-SD001",
      policyType: "UI_SPEC",
      scope: "ELEMENT",
      title: "날짜 범위 선택 규칙",
      content: "기본값: 최근 30일. 최대 조회 범위: 1년. 미래 날짜 선택 불가. 형식: YYYY-MM-DD.",
      tableMapping: "PB_PRODUCT.CREATED_AT",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-02-01",
      version: 1,
    },
  ],

  "SamplePage.SearchForm.SearchButton": [
    {
      policyId: "POL-SB001",
      policyType: "INTERACTION",
      scope: "ELEMENT",
      title: "검색 버튼 동작",
      content: "클릭 시 검색 조건 유효성 검증 후 API 호출. 로딩 중 버튼 비활성화. 결과 0건 시 '검색 결과가 없습니다' 안내.",
      apiSpec: "GET /api/products?name={}&category={}&status={}&priceMin={}&priceMax={}&seller={}&from={}&to={}&page=1&size=20",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-02-01",
      version: 1,
    },
  ],

  // ── 그리드 영역 ──
  "SamplePage.ProductGrid": [
    {
      policyId: "POL-PG001",
      policyType: "UI_SPEC",
      scope: "COMPONENT",
      title: "상품 그리드 표시 규칙",
      content: "기본 정렬: 최신 등록순. 페이징: 20건 단위. 컬럼: 상품ID, 상품명, 카테고리, 가격, 할인율, 재고, 상태, 판매자, 등록일.",
      tableMapping: "PB_PRODUCT (전체 조회)",
      apiSpec: "GET /api/products?page={page}&size=20&sort=createdAt,desc",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-02-25",
      version: 2,
    },
    {
      policyId: "POL-PG002",
      policyType: "INTERACTION",
      scope: "COMPONENT",
      title: "그리드 행 선택 동작",
      content: "행 클릭 시 우측에 수정 패널 표시. 선택된 행은 하이라이트(파란 배경). 동시에 1건만 선택 가능.",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-02-25",
      version: 1,
    },
  ],

  "SamplePage.ProductGrid.ProductIdCell": [
    {
      policyId: "POL-PC001",
      policyType: "UI_SPEC",
      scope: "ELEMENT",
      title: "상품ID 셀 표시",
      content: "PRD-XXX 형태로 고정 표시. 수정 불가(읽기 전용). 클릭 시 클립보드 복사.",
      tableMapping: "PB_PRODUCT.PRODUCT_ID (PK, VARCHAR2(36))",
      approvedBy: "김민수 (개발)",
      approvedAt: "2026-02-25",
      version: 1,
    },
  ],

  "SamplePage.ProductGrid.PriceCell": [
    {
      policyId: "POL-PP001",
      policyType: "UI_SPEC",
      scope: "ELEMENT",
      title: "가격 셀 표시",
      content: "천단위 콤마 적용. '원' 접미사. 할인 있을 시 원가 취소선 + 할인가 강조.",
      tableMapping: "PB_PRODUCT.PRICE (NUMBER(10))",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-02-25",
      version: 1,
    },
  ],

  "SamplePage.ProductGrid.StatusCell": [
    {
      policyId: "POL-PS001",
      policyType: "UI_SPEC",
      scope: "ELEMENT",
      title: "상태 셀 표시",
      content: "뱃지 색상 — 판매중: green, 품절: orange, 숨김: gray, 삭제: red.",
      tableMapping: "PB_PRODUCT.STATUS (VARCHAR2(20))",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-02-25",
      version: 1,
    },
  ],

  // ── 수정 패널 ──
  "SamplePage.EditPanel": [
    {
      policyId: "POL-EP001",
      policyType: "UI_SPEC",
      scope: "COMPONENT",
      title: "수정 패널 레이아웃",
      content: "우측 슬라이드 패널 형태. 너비 400px. 상단: 상품ID(읽기전용), 하단: 수정 가능 필드들. 저장/취소 버튼.",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-03-01",
      version: 1,
    },
    {
      policyId: "POL-EP002",
      policyType: "INTERACTION",
      scope: "COMPONENT",
      title: "수정 패널 저장 동작",
      content: "저장 클릭 → 유효성 검증 → API 호출(PUT) → 성공 시 토스트 '저장되었습니다' → 그리드 갱신. 실패 시 에러 메시지 표시.",
      apiSpec: "PUT /api/products/{productId}",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-03-01",
      version: 1,
    },
  ],

  "SamplePage.EditPanel.ProductNameField": [
    {
      policyId: "POL-EN001",
      policyType: "VALIDATION",
      scope: "ELEMENT",
      title: "상품명 수정 검증",
      content: "필수 입력. 최소 2자 ~ 최대 100자. 특수문자 <, >, \", ' 사용 불가. 앞뒤 공백 자동 trim. 중복 상품명 실시간 검증 (500ms debounce).",
      tableMapping: "PB_PRODUCT.PRODUCT_NAME (VARCHAR2(200), NOT NULL)",
      apiSpec: "GET /api/products/check-name?name={name}&excludeId={productId}",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-03-05",
      version: 2,
    },
  ],

  "SamplePage.EditPanel.PriceField": [
    {
      policyId: "POL-EP-PRICE001",
      policyType: "VALIDATION",
      scope: "ELEMENT",
      title: "가격 수정 검증",
      content: "숫자만 입력 가능. 최소 100원 ~ 최대 10,000,000원. 10원 단위만 허용.",
      tableMapping: "PB_PRODUCT.PRICE (NUMBER(10), NOT NULL)",
      approvedBy: "김민수 (개발)",
      approvedAt: "2026-03-05",
      version: 1,
    },
    {
      policyId: "POL-EP-PRICE002",
      policyType: "BIZ_RULE",
      scope: "ELEMENT",
      title: "할인가 제약 규칙",
      content: "할인가는 원가의 10% 이상이어야 함 (90% 이상 할인 금지). 위반 시 '할인율이 너무 높습니다' 경고.",
      tableMapping: "PB_PRODUCT.DISCOUNT_RATE (NUMBER(3))",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-03-05",
      version: 1,
    },
  ],

  "SamplePage.EditPanel.DiscountField": [
    {
      policyId: "POL-ED001",
      policyType: "VALIDATION",
      scope: "ELEMENT",
      title: "할인율 입력 규칙",
      content: "0 ~ 90 범위 정수만 입력 가능. 단위: %. 빈 값 허용(할인 없음 = 0).",
      tableMapping: "PB_PRODUCT.DISCOUNT_RATE (NUMBER(3), DEFAULT 0)",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-03-05",
      version: 1,
    },
  ],

  "SamplePage.EditPanel.StockField": [
    {
      policyId: "POL-ES001",
      policyType: "BIZ_RULE",
      scope: "ELEMENT",
      title: "재고 수정 비즈니스 규칙",
      content: "재고 0으로 변경 시 상태를 자동으로 SOLDOUT으로 전환할지 확인 모달 표시. 음수 입력 불가.",
      tableMapping: "PB_PRODUCT.STOCK (NUMBER(7), NOT NULL)",
      approvedBy: "박지현 (PM)",
      approvedAt: "2026-03-10",
      version: 1,
    },
  ],

  "SamplePage.EditPanel.StatusField": [
    {
      policyId: "POL-EST001",
      policyType: "PERMISSION",
      scope: "ELEMENT",
      title: "상태 변경 권한",
      content: "SALE ↔ HIDDEN: 일반 관리자 허용. DELETED 전환: 슈퍼관리자만 허용. SOLDOUT → SALE: 재고 1 이상일 때만 허용.",
      tableMapping: "PB_PRODUCT.STATUS (VARCHAR2(20))",
      approvedBy: "이상훈 (CTO)",
      approvedAt: "2026-03-10",
      version: 2,
    },
  ],

  "SamplePage.EditPanel.SaveButton": [
    {
      policyId: "POL-ESV001",
      policyType: "INTERACTION",
      scope: "ELEMENT",
      title: "저장 버튼 동작",
      content: "모든 필드 유효성 검증 통과 후 활성화. 클릭 시 PUT API 호출. 저장 중 스피너 표시. 성공/실패 토스트 메시지.",
      apiSpec: "PUT /api/products/{productId}  Body: { productName, price, discountRate, stock, status }",
      approvedBy: "이서연 (백엔드)",
      approvedAt: "2026-03-10",
      version: 1,
    },
  ],
};
