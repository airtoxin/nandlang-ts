# E2Eテスト（Playwright）

Claude Code の Playwright Skill を使ってブラウザ動作確認を自動化する。

## セットアップ

### Playwright CLI

mise 経由でグローバルインストール: `mise use -g npm:playwright`

### Playwright Skill

`~/.claude/skills/playwright-skill/` にインストール済み。
Claude Code から `/playwright-skill` で呼び出し可能。

スクリプトは `/tmp/playwright-test-*.js` に書き、`cd ~/.claude/skills/playwright-skill && node run.js <script>` で実行。

### システム依存（WSL2）

Chromium 実行に以下のパッケージが必要:
`libnspr4`, `libnss3`, `libatk1.0-0`, `libatk-bridge2.0-0`, `libcups2`, `libdrm2`, `libxkbcommon0`, `libxcomposite1`, `libxdamage1`, `libxfixes3`, `libxrandr2`, `libgbm1`, `libpango-1.0-0`, `libcairo2`, `libasound2t64`

## テスト対象の主要UIセレクター

| セレクター | 要素 |
|-----------|------|
| `button.compile-btn` | Compile & Run ボタン |
| `button.run-btn` | Run All ボタン |
| `button.step-btn` | Step ボタン |
| `button.next-level-btn` | Next Level → ボタン |
| `.success-banner` | 全テスト通過バナー |
| `.panel-header h3` | パズルタイトル |

## 注意事項

- WSL2 環境では Windows 側の Chrome は使用不可（パイプ通信非対応）
- headless モードを使用（WSL2 にディスプレイなし）
- スクリーンショットは `/tmp/` に保存（プロジェクトを汚さない）
