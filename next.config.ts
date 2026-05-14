import type { NextConfig } from "next";

const isPlanBridgeEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.PLANBRIDGE_ENABLED === "true";

const nextConfig: NextConfig = {
  // PlanBridge 빌드 플러그인
  // data-pb-id 속성을 JSX 요소에 자동으로 주입합니다.
  // - 개발/스테이징 환경: 자동 활성화
  // - 프로덕션: PLANBRIDGE_ENABLED=true 환경변수로 활성화
  ...(isPlanBridgeEnabled && {
    babel: {
      plugins: [
        // plugins/babel-pb-id.js: data-pb-id 자동 주입
        require.resolve("./plugins/babel-pb-id.js"),
      ],
    },
  }),
};

export default nextConfig;
