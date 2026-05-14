import type { NextConfig } from "next";

const isPlanBridgeEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.PLANBRIDGE_ENABLED === "true";

const nextConfig: NextConfig = {
  // PlanBridge 빌드 플러그인
  // data-pb-id 속성을 JSX 요소에 자동으로 주입합니다.
  // - 개발/스테이징 환경: 자동 활성화
  // - 프로덕션: PLANBRIDGE_ENABLED=true 환경변수로 활성화
  experimental: {
    ...(isPlanBridgeEnabled && {
      // Next.js 15+ babel 설정
    }),
  },
  ...(isPlanBridgeEnabled && {
    babel: {
      plugins: [
        // planbridge-babel-plugin: data-pb-id 자동 주입
        // 내부망 배포 시 로컬 경로로 변경 가능:
        // require.resolve('../planbridge-plugin/src/index.js')
        require.resolve("../planbridge-plugin/src/index.js"),
      ],
    },
  }),
};

export default nextConfig;
