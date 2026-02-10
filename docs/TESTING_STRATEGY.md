# Testing & Code Quality Strategy

**Last Updated:** 2026-02-10
**Status:** Planning Phase
**Target Implementation:** Phase 4-6 Development

---

## Overview

Comprehensive testing strategy for String.sg v2 focused on security validation, performance monitoring, and critical user journey protection. Designed to be lightweight while ensuring production confidence as we scale features.

## Test Architecture

### **Framework Stack**
- **Unit/Integration**: Vitest (Vite-native, TypeScript support)
- **Component**: React Testing Library + Vitest
- **E2E**: Playwright (multi-browser support)
- **Database**: SQLite (integration) + Docker Postgres (E2E)
- **Performance**: Lighthouse CI + Custom metrics

### **Test Organization**
```
tests/
├── unit/                 # Pure functions, utilities
│   ├── slug-utils.test.ts
│   ├── auth-helpers.test.ts
│   └── bump-rules.test.ts
├── integration/          # API endpoints + database
│   ├── api/
│   │   ├── profile.test.ts
│   │   ├── users.test.ts
│   │   ├── submissions.test.ts
│   │   └── apps.test.ts
│   └── database/
│       ├── queries.test.ts
│       └── migrations.test.ts
├── components/           # React component behavior
│   ├── PersonalProfile.test.tsx
│   ├── UserDashboard.test.tsx
│   ├── Router.test.tsx
│   └── AppGrid.test.tsx
├── e2e/                 # Critical user journeys
│   ├── signup-flow.spec.ts
│   ├── profile-management.spec.ts
│   ├── app-submission.spec.ts
│   └── security-validation.spec.ts
├── fixtures/            # Test data factories
│   ├── users.ts
│   ├── apps.ts
│   └── submissions.ts
└── helpers/             # Test utilities
    ├── database.ts
    ├── auth-mock.ts
    └── performance.ts
```

## Database Testing Strategy

### **Hybrid Approach**
- **Unit Tests**: Mocked database calls for pure logic testing
- **Integration Tests**: In-memory SQLite for API endpoint testing
- **E2E Tests**: Docker Postgres containers for production parity

### **Rationale**
- ⚡ **Speed**: Unit tests run in milliseconds with mocks
- 🔧 **Simplicity**: SQLite requires zero setup for most integration tests
- 🎯 **Confidence**: Docker Postgres ensures production-specific behaviors work
- 🚀 **CI/CD**: Lightweight enough for fast feedback loops

## Critical Test Coverage

### **Priority 1: Security & Core Functionality**

#### **Slug Generation Security**
```typescript
// slug-utils.test.ts
describe('generateSlugFromEmail', () => {
  test('prevents SQL injection attempts')
  test('blocks reserved slug generation')
  test('handles collision detection properly')
  test('sanitizes Unicode and special characters')
})
```

#### **API Security Validation**
```typescript
// profile.test.ts
describe('Profile API Security', () => {
  test('users can only modify own profiles')
  test('non-approved apps hidden from public profiles')
  test('input validation on both client and server')
  test('proper authorization checks on all endpoints')
})
```

#### **Profile Visibility Rules**
```typescript
// visibility.test.ts
describe('App Visibility Controls', () => {
  test('approved apps appear on public profiles')
  test('pending apps hidden from others but visible to owner')
  test('rejected apps never appear publicly')
  test('visibility toggles work correctly')
})
```

### **Priority 2: Critical User Journeys (E2E)**

#### **Complete Profile Workflow**
```typescript
// profile-management.spec.ts
test('end-to-end profile creation and management', async () => {
  // 1. User signs up → auto slug generation
  // 2. User pins apps from homepage
  // 3. User submits new app
  // 4. User manages app visibility in dashboard
  // 5. Public profile displays correctly
  // 6. Profile URL sharing works across browsers
})
```

#### **App Submission & Approval Workflow**
```typescript
// app-submission.spec.ts
test('app submission lifecycle', async () => {
  // 1. Submit app → appears in user dashboard
  // 2. Admin approval simulation
  // 3. App becomes visible on public profile
  // 4. Proper categorization and display
})
```

#### **Security Validation Flows**
```typescript
// security-validation.spec.ts
test('security boundary enforcement', async () => {
  // 1. Attempt to access other users' profile management
  // 2. Try to view non-approved apps on public profiles
  // 3. Test SQL injection via profile endpoints
  // 4. Validate XSS protection on user inputs
})
```

### **Priority 3: Performance & Quality**

#### **Performance Benchmarks**
- 🎯 **API Response Times**: < 200ms for all endpoints
- 🚀 **Profile Page Load**: < 1.5s (including apps data)
- 📦 **Bundle Size**: Monitor and alert on 10%+ increases
- 💾 **Database Queries**: N+1 detection and optimization

#### **Cross-Browser Testing**
- **Chrome**: Primary development and testing
- **Brave**: Privacy-focused browser compatibility
- **Safari**: iOS/macOS user experience
- **Firefox**: Standards compliance validation

## SAST & Security Tooling

### **Static Analysis Pipeline**
```json
{
  "pre-commit-hooks": [
    "eslint --ext .ts,.tsx --fix",
    "prettier --write",
    "tsc --noEmit",
    "vitest run --coverage --threshold=90"
  ],
  "ci-pipeline": [
    "security-scan",
    "dependency-audit",
    "performance-test",
    "e2e-tests"
  ]
}
```

### **Security Tools Integration**

#### **Code Analysis**
- **ESLint Security**: `@typescript-eslint/recommended-requiring-type-checking`
- **Semgrep**: Community security rules for React/Node.js
- **TypeScript**: Strict mode with null checks
- **Custom Rules**: String.sg specific security patterns

#### **Dependency Security**
- **npm audit**: Automated vulnerability scanning
- **Dependabot**: Automated security updates
- **License Compliance**: MIT/Apache-2.0 whitelist
- **Supply Chain**: Package signature validation

#### **Runtime Security Testing**
```typescript
// security.test.ts
describe('Runtime Security', () => {
  test('input sanitization prevents XSS')
  test('SQL parameterization prevents injection')
  test('authorization middleware blocks unauthorized access')
  test('rate limiting prevents abuse')
})
```

## Implementation Phases

### **Phase 1: Foundation (Week 1)**
- [ ] Vitest configuration with TypeScript support
- [ ] Slug utility comprehensive unit tests
- [ ] Basic API integration tests with SQLite
- [ ] Security-focused ESLint configuration
- [ ] Test data factories and helpers

### **Phase 2: Core Features (Week 2)**
- [ ] Profile management component tests
- [ ] Database security validation tests
- [ ] E2E signup and profile creation flow
- [ ] Performance baseline establishment
- [ ] Cross-browser compatibility setup

### **Phase 3: Security & Polish (Week 3)**
- [ ] Comprehensive security test suite
- [ ] Docker Postgres E2E environment
- [ ] CI/CD pipeline with all quality gates
- [ ] Performance monitoring integration
- [ ] Security scanning automation

## Required Configuration Files

### **Test Configuration**
```bash
vitest.config.ts           # Test runner configuration
playwright.config.ts       # E2E browser testing
docker-compose.test.yml     # Test database setup
jest.setup.ts              # Test environment setup
```

### **Security Configuration**
```bash
.eslintrc.security.js       # Security-focused linting
.semgrepignore              # Security scan exceptions
.nvmrc                      # Node version consistency
.github/workflows/test.yml  # CI/CD security pipeline
```

### **Performance Configuration**
```bash
lighthouse.config.js        # Performance benchmarks
bundle-analyzer.config.js   # Bundle size monitoring
performance.thresholds.json # Performance gates
```

## Success Metrics & Quality Gates

### **Coverage Requirements**
- 🎯 **95%+ test coverage** on critical business logic
- 🔒 **100% coverage** on security-related functions
- 📱 **90%+ coverage** on React components
- 🗄️ **85%+ coverage** on API endpoints

### **Performance Gates**
- 🚀 **API Responses**: 95th percentile < 200ms
- 📄 **Page Load**: LCP < 1.5s, CLS < 0.1
- 📦 **Bundle Size**: Core bundle < 250KB gzipped
- 💾 **Database**: Query time < 50ms average

### **Security Requirements**
- 🔒 **Zero high/critical vulnerabilities** in dependencies
- 🛡️ **100% security test coverage** on auth flows
- 🔍 **SAST scan score** > 95/100
- 📋 **Security checklist** completed per release

### **Quality Metrics**
- 🐛 **Zero production bugs** related to tested functionality
- 📱 **Cross-browser compatibility** validated on all target browsers
- ⚡ **Test suite performance**: Full suite < 5 minutes
- 🔄 **Deployment confidence**: Automated promotion criteria

## Maintenance Strategy

### **Automated Maintenance**
- **Daily**: Dependency security scans
- **Weekly**: Performance benchmark reviews
- **Monthly**: Test suite optimization
- **Quarterly**: Security tool updates

### **Manual Reviews**
- **Per Feature**: New test requirements assessment
- **Per Sprint**: Test coverage gap analysis
- **Pre-Release**: Full security and performance validation
- **Post-Incident**: Test coverage enhancement

## Integration with Development Workflow

### **Developer Experience**
```bash
# Fast feedback loop
npm run test:watch          # Unit tests with hot reload
npm run test:integration    # API tests with SQLite
npm run test:e2e:dev       # E2E tests in headed mode
npm run test:security      # Security scans and validation
```

### **CI/CD Integration**
```bash
# Pull Request Checks
npm run test:unit          # < 30 seconds
npm run test:integration   # < 2 minutes
npm run lint:security      # < 30 seconds
npm run build:check        # < 1 minute

# Pre-Merge Validation
npm run test:e2e          # < 5 minutes
npm run test:performance  # < 3 minutes
npm run security:scan     # < 2 minutes
```

## Future Considerations

### **Scaling Strategies**
- **Test Parallelization**: Distribute E2E tests across multiple browsers
- **Snapshot Testing**: Visual regression testing for UI components
- **Contract Testing**: API contract validation with Pact
- **Chaos Engineering**: Resilience testing under failure conditions

### **Advanced Security**
- **Penetration Testing**: Quarterly professional security assessments
- **Bug Bounty Program**: Community-driven vulnerability discovery
- **Security Headers**: Automated security header validation
- **Content Security Policy**: CSP violation monitoring

---

## Getting Started

When ready to implement, start with Phase 1 foundation setup:

```bash
npm install -D vitest @vitest/ui react-testing-library
npm install -D playwright @playwright/test
npm install -D eslint-plugin-security semgrep
```

This strategy balances comprehensive coverage with practical implementation, ensuring String.sg maintains high quality as it scales to serve Singapore's education community.