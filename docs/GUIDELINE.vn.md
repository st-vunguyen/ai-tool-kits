# API Testing Kit — Practical Guideline (Vietnamese)

> Nguồn support chuẩn: `.github/prompts/`, `.claude/agents/`, `.claude/rules/`, `.claude/skills/`, `templates/api-pack/`, `scripts/`, `specs/`, và `result/`.

> English version: `docs/GUIDELINE.md`

## 1. Mục tiêu thực dụng

Kit này tồn tại để biến OpenAPI hoặc Swagger spec thành một bộ API testing asset có thể tái sử dụng, có traceability và có evidence.

Luồng chuẩn là:

```text
Spec → Review → Strategy → Runnable Assets → Execution → Evidence
```

Mục tiêu không chỉ là tạo ra collection chạy được. Mục tiêu là tạo ra một pack đủ rõ để:

- review spec và phát hiện gaps sớm
- ưu tiên đúng phạm vi test
- scaffold nhanh functional, scenario, performance, và security assets
- chạy bằng runtime wrappers nhất quán
- lưu evidence và report đúng vị trí

## 2. Operating model bắt buộc

### Source of truth

- Spec nằm trong `specs/<slug>/`.
- Prompt source chuẩn nằm trong `.github/prompts/`.
- Output chỉ được ghi vào `result/<slug>/`.

### Output model

```text
result/<slug>/
├── README.md
├── 01-review/
├── 02-strategy/
├── 03-scenarios/
├── 04-traceability/
├── 05-postman/
├── 06-env/
├── 07-data/
├── 08-helpers/
├── 09-performance/
└── 10-reports/
	├── raw/
	├── performance/
	├── security-baseline/
	├── verification/
	└── maintenance/
```

### Thứ tự nên đọc trong một output pack

1. `result/<slug>/README.md`
2. `result/<slug>/02-strategy/`
3. `result/<slug>/04-traceability/`
4. `result/<slug>/10-reports/<report-family>/<run-slug>/00_index.md`

### Command policy

- Toàn bộ hướng dẫn sử dụng phải đi qua `pnpm` hoặc `pnpx`.
- Không yêu cầu người dùng gõ raw `node`, `bash`, `brew`, hoặc `docker` command.
- Wrapper của repo sẽ tự chọn local binary hoặc container khi chạy.

## 3. Quy trình khuyến nghị

### Bước 1 — Chuẩn bị runtime

```bash
pnpm install
pnpm run runtime:plan
pnpm run runtime:prepare
pnpm run runtime:doctor
```

### Bước 2 — Scaffold workspace cho một API

```bash
pnpm run apply:dry-run -- --slug <slug>
pnpm run apply -- --slug <slug>
```

Nếu spec không nằm đúng file mặc định, truyền rõ đường dẫn:

```bash
pnpm run apply -- --slug <slug> --spec specs/<slug>/openapi.yaml
```

### Bước 3 — Chạy đúng prompt cho đúng phase

- Bắt đầu từ `.github/prompts/00-orchestration/00-run-pipeline.prompt.md` nếu muốn full flow.
- Hoặc chọn từng prompt chuyên biệt theo scope hiện tại.
- Mọi output phải rơi đúng phase dưới `result/<slug>/`.

### Bước 4 — Tạo runnable assets

- `01-review/`: lint, spec review, auth, pagination, patterns, snapshot
- `02-strategy/`: strategy, scope, risk, priority
- `03-scenarios/`: journeys, integration, regression
- `04-traceability/`: status matrix, mapping, coverage model
- `05-postman/`, `06-env/`, `07-data/`, `08-helpers/`, `09-performance/`: runnable packs và runbook

### Bước 5 — Chạy bằng wrapper chuẩn

```bash
pnpm run tool:newman -- run result/<slug>/05-postman/collection.json
pnpm run tool:k6 -- run result/<slug>/09-performance/k6-script.js
pnpm run tool:zap -- -cmd -version
pnpm run tool:jmeter -- -n -t result/<slug>/09-performance/jmeter/test-plan.jmx
```

### Bước 6 — Ghi evidence và report

- Raw outputs vào `result/<slug>/10-reports/raw/`.
- Curated reports vào `result/<slug>/10-reports/<report-family>/<run-slug>/`.
- Report family nên dùng là `performance/`, `security-baseline/`, `verification/`, và `maintenance/`.
- Phải tách asset issue, system issue, và evidence gaps.
- Khi stack hỗ trợ hợp lý, curated execution/verification report nên có thêm `dashboard.html` để review nhanh.

Ví dụ lệnh render dashboard:

```bash
pnpm run report:dashboard -- build --mode newman --input result/<slug>/10-reports/raw/performance/<run-slug>/newman-summary.json --output-dir result/<slug>/10-reports/performance/<run-slug>
```

### Bước 7 — Chạy lượt trust pass cuối khi cần

- Dùng `.github/prompts/05-maintenance/27-verification-findings-and-recommendations.prompt.md` khi cần một gói verify ở mức triage/chốt chất lượng.
- Lượt này phải kiểm tra contradiction, likely root cause, confidence boundary, và recommendation có ưu tiên.
- Ghi output vào `result/<slug>/10-reports/verification/<run-slug>/`.

## 4. Chọn flow theo nhu cầu

### Full pipeline

Dùng khi cần dựng nền QA hoàn chỉnh cho một API mới.

- Bắt đầu với orchestration prompt.
- Đi từ review → strategy → functional → performance/security.
- Khi spec thay đổi, chạy maintenance và chỉ refresh phần bị impact.

### Functional-first

Dùng khi mục tiêu gần nhất là smoke, regression, hoặc contract coverage.

- Ưu tiên `01` → `09`.
- Thêm `10` → `17` nếu business journey phức tạp hơn.
- Hoãn performance/security nếu chưa đủ điều kiện.

### Performance-first

Dùng khi đã có functional pack cơ bản và cần workload rõ ràng.

- Ưu tiên `18`, `19`, `21`, và `23` → `26`.
- Luôn ghi rõ giả định, ngưỡng, và evidence source.

### Security baseline

Dùng khi cần ZAP baseline scan sớm.

- Ưu tiên `01`, `02`, `06`, và `20`.
- Không claim hệ thống an toàn nếu mới chỉ có baseline evidence.

## 5. Guardrails bắt buộc

- Không dừng ở success-only coverage nếu spec có thêm status codes có evidence.
- Không commit real secrets hoặc current-value environments.
- Không ghi output ra ngoài `result/<slug>/`.
- Không coi repo này như app repo; không generate product runtime code hoặc CI mặc định.
- Nếu chưa có evidence, ghi `Unknown / needs confirmation` thay vì tự bịa.

## 6. Checklist trước khi handoff

- `pnpm run runtime:doctor` xác nhận runtime cần cho flow hiện tại.
- `result/<slug>/` có đúng phase layout.
- `04-traceability/` phản ánh rõ multi-status coverage.
- `10-reports/` tách raw artifacts và curated findings rõ ràng.
- `10-reports/` phải dùng family folder rõ ràng, không tạo run folder lỏng trực tiếp dưới root.
- Runbook, env template, và data samples khớp với runner sẽ dùng thật.

## 7. Lỗi thường gặp cần tránh

### Xem collection là mục tiêu cuối

Collection chỉ là công cụ. Nếu không có strategy, coverage rất dễ nông hoặc lệch trọng tâm.

### Assert những điều spec không chứng minh

Ví dụ:

- assume default sort order
- assume mọi error schema đều giống nhau
- assume rate-limit header luôn tồn tại
- assume eventual consistency là bug

Nếu spec không chứng minh, hãy ghi là gap.

### Có env file nhưng không có contract

Người dùng sau cần biết:

- biến nào set tay
- biến nào capture động
- biến nào derived
- biến nào bắt buộc cho từng flow

### Chạy performance trên environment không được phép

Đây là lỗi rủi ro nhất. Các performance prompt nên giữ giả định an toàn cho tới khi environment được approve rõ ràng.

### Có raw output nhưng không có curated evidence

Log raw, CSV, hoặc HTML chưa đủ để ra quyết định. Vẫn cần một report giải thích:

- đã chạy cái gì
- chạy ở đâu
- giới hạn nào đã bật
- số liệu nào đáng tin
- kết luận nào vẫn chỉ là assumption
