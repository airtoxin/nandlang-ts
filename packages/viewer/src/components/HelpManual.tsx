import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type Props = {
  onClose: () => void;
  highlightSections?: string[];
};

type Section = {
  id: string;
  title: string;
  content: ReactNode;
};

const sections: Section[] = [
  {
    id: "syntax-var",
    title: "VAR: ノードを配置する",
    content: (
      <>
        <p>
          回路図上にモジュールをノードとして配置します。
          名前をつけることで、WIRE文で結線するときの対象を指定できます。
        </p>
        <pre>VAR [名前] [モジュール名]</pre>
        <p>
          例: <code>my_nand</code> という名前でNANDゲートを配置し、
          <code>x</code> という名前でNOTゲートを配置する場合:
        </p>
        <pre>{`VAR my_nand NAND
VAR x NOT`}</pre>
        <p>Compileを押すと、右の回路図にノードが表示されます。</p>
      </>
    ),
  },
  {
    id: "syntax-wire",
    title: "WIRE: ノード同士を結線する",
    content: (
      <>
        <p>
          2つのノードのポート（接続口）同士をワイヤーでつなぎます。
          信号は出力ポートから入力ポートへ流れます。
        </p>
        <pre>WIRE [出力元の名前] [出力ポート] TO [入力先の名前] [入力ポート]</pre>
        <p>
          ポートが1つしかないモジュールでは、ポート名の代わりに <code>_</code> と書けます。
        </p>
        <p>例: 入力 <code>a</code> をNANDの <code>i0</code> ポートへつなぐ場合:</p>
        <pre>{`WIRE a _ TO my_nand i0`}</pre>
        <p>Compileすると、回路図上にワイヤー（矢印）が表示されます。</p>
      </>
    ),
  },
  {
    id: "syntax-comment",
    title: "コメント",
    content: (
      <>
        <p>
          <code>#</code> で始まる行はメモとして残せます。回路の動作には影響しません。
        </p>
        <pre># これはメモです</pre>
      </>
    ),
  },
  {
    id: "mod-bitin",
    title: "BITIN: 外部入力",
    content: (
      <>
        <p>
          テストケースから信号を受け取るノードです。
          パズルでは <code>a</code> や <code>b</code> など、あらかじめ配置されています。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>o0</code> / <code>_</code></td><td>出力</td><td>テストの入力値がここから出る</td></tr>
          </tbody>
        </table>
        <p>ポートが1つなので、WIRE文では <code>_</code> で指定できます。</p>
      </>
    ),
  },
  {
    id: "mod-bitout",
    title: "BITOUT: 外部出力",
    content: (
      <>
        <p>
          回路の計算結果をテストケースに渡すノードです。
          パズルでは <code>out</code> などとしてあらかじめ配置されています。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>i0</code> / <code>_</code></td><td>入力</td><td>ここに入った値がテスト結果になる</td></tr>
          </tbody>
        </table>
        <p>ポートが1つなので、WIRE文では <code>_</code> で指定できます。</p>
      </>
    ),
  },
  {
    id: "mod-nand",
    title: "NAND: 基本ゲート",
    content: (
      <>
        <p>
          すべての回路の基礎となるゲートです。
          2つの入力が両方とも1のときだけ0を出力し、それ以外は1を出力します。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>i0</code></td><td>入力</td><td>入力A</td></tr>
            <tr><td><code>i1</code></td><td>入力</td><td>入力B</td></tr>
            <tr><td><code>o0</code> / <code>_</code></td><td>出力</td><td>結果</td></tr>
          </tbody>
        </table>
        <p>真理値表:</p>
        <table>
          <thead>
            <tr><th>i0</th><th>i1</th><th>出力</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>0</td><td>1</td></tr>
            <tr><td>0</td><td>1</td><td>1</td></tr>
            <tr><td>1</td><td>0</td><td>1</td></tr>
            <tr><td>1</td><td>1</td><td>0</td></tr>
          </tbody>
        </table>
        <p>出力ポートは1つなので、WIRE文では <code>_</code> で指定できます。</p>
      </>
    ),
  },
  {
    id: "gate-not",
    title: "NOT: 反転",
    content: (
      <>
        <p>入力の0と1を反転して出力します。</p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th></tr>
          </thead>
          <tbody>
            <tr><td><code>in</code> / <code>_</code></td><td>入力</td></tr>
            <tr><td><code>out</code> / <code>_</code></td><td>出力</td></tr>
          </tbody>
        </table>
        <p>真理値表:</p>
        <table>
          <thead>
            <tr><th>入力</th><th>出力</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>1</td></tr>
            <tr><td>1</td><td>0</td></tr>
          </tbody>
        </table>
        <p>入出力とも1ポートなので、WIRE文では両方 <code>_</code> で指定できます。</p>
        <details>
          <summary>ヒント: NANDからNOTを作るには</summary>
          <p>NANDの2つの入力に同じ信号を入れると、反転になります。</p>
        </details>
      </>
    ),
  },
  {
    id: "gate-and",
    title: "AND: 論理積",
    content: (
      <>
        <p>2つの入力が両方とも1のときだけ1を出力します。</p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th></tr>
          </thead>
          <tbody>
            <tr><td><code>i0</code></td><td>入力</td></tr>
            <tr><td><code>i1</code></td><td>入力</td></tr>
            <tr><td><code>o0</code> / <code>_</code></td><td>出力</td></tr>
          </tbody>
        </table>
        <p>真理値表:</p>
        <table>
          <thead>
            <tr><th>i0</th><th>i1</th><th>出力</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>0</td><td>0</td></tr>
            <tr><td>0</td><td>1</td><td>0</td></tr>
            <tr><td>1</td><td>0</td><td>0</td></tr>
            <tr><td>1</td><td>1</td><td>1</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント: NANDからANDを作るには</summary>
          <p>NANDの出力をNOTで反転すればANDになります。</p>
        </details>
      </>
    ),
  },
  {
    id: "gate-or",
    title: "OR: 論理和",
    content: (
      <>
        <p>2つの入力のどちらかが1なら1を出力します。</p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th></tr>
          </thead>
          <tbody>
            <tr><td><code>i0</code></td><td>入力</td></tr>
            <tr><td><code>i1</code></td><td>入力</td></tr>
            <tr><td><code>o0</code> / <code>_</code></td><td>出力</td></tr>
          </tbody>
        </table>
        <p>真理値表:</p>
        <table>
          <thead>
            <tr><th>i0</th><th>i1</th><th>出力</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>0</td><td>0</td></tr>
            <tr><td>0</td><td>1</td><td>1</td></tr>
            <tr><td>1</td><td>0</td><td>1</td></tr>
            <tr><td>1</td><td>1</td><td>1</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント: NANDからORを作るには</summary>
          <p>各入力をそれぞれNOTで反転してから、NANDに入れます。</p>
        </details>
      </>
    ),
  },
  {
    id: "gate-nor",
    title: "NOR: 否定論理和",
    content: (
      <>
        <p>2つの入力が両方とも0のときだけ1を出力します。ORの結果を反転したものです。</p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th></tr>
          </thead>
          <tbody>
            <tr><td><code>i0</code></td><td>入力</td></tr>
            <tr><td><code>i1</code></td><td>入力</td></tr>
            <tr><td><code>o0</code> / <code>_</code></td><td>出力</td></tr>
          </tbody>
        </table>
        <p>真理値表:</p>
        <table>
          <thead>
            <tr><th>i0</th><th>i1</th><th>出力</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>0</td><td>1</td></tr>
            <tr><td>0</td><td>1</td><td>0</td></tr>
            <tr><td>1</td><td>0</td><td>0</td></tr>
            <tr><td>1</td><td>1</td><td>0</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>ORの出力をNOTで反転すればNORになります。</p>
        </details>
      </>
    ),
  },
  {
    id: "gate-xor",
    title: "XOR: 排他的論理和",
    content: (
      <>
        <p>2つの入力が異なるときだけ1を出力します。</p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th></tr>
          </thead>
          <tbody>
            <tr><td><code>i0</code></td><td>入力</td></tr>
            <tr><td><code>i1</code></td><td>入力</td></tr>
            <tr><td><code>o0</code> / <code>_</code></td><td>出力</td></tr>
          </tbody>
        </table>
        <p>真理値表:</p>
        <table>
          <thead>
            <tr><th>i0</th><th>i1</th><th>出力</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>0</td><td>0</td></tr>
            <tr><td>0</td><td>1</td><td>1</td></tr>
            <tr><td>1</td><td>0</td><td>1</td></tr>
            <tr><td>1</td><td>1</td><td>0</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>「NANDの結果」と「ORの結果」の両方が1のとき、つまりANDを取ればXORになります。</p>
        </details>
      </>
    ),
  },
  {
    id: "gate-xnor",
    title: "XNOR: 排他的否定論理和",
    content: (
      <>
        <p>2つの入力が同じときだけ1を出力します。XORの結果を反転したものです。</p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th></tr>
          </thead>
          <tbody>
            <tr><td><code>i0</code></td><td>入力</td></tr>
            <tr><td><code>i1</code></td><td>入力</td></tr>
            <tr><td><code>o0</code> / <code>_</code></td><td>出力</td></tr>
          </tbody>
        </table>
        <p>真理値表:</p>
        <table>
          <thead>
            <tr><th>i0</th><th>i1</th><th>出力</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>0</td><td>1</td></tr>
            <tr><td>0</td><td>1</td><td>0</td></tr>
            <tr><td>1</td><td>0</td><td>0</td></tr>
            <tr><td>1</td><td>1</td><td>1</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>XORの出力をNOTで反転すればXNORになります。</p>
        </details>
      </>
    ),
  },
];

export function HelpManual({ onClose, highlightSections }: Props) {
  const [position, setPosition] = useState({ x: 100, y: 60 });
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  }, [position]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const onMouseUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const highlightSet = new Set(highlightSections ?? []);
  const selected = selectedSection
    ? sections.find((s) => s.id === selectedSection) ?? null
    : null;

  return (
    <div
      className="help-modal"
      style={{ left: position.x, top: position.y }}
    >
      <div className="help-modal-header" onMouseDown={onMouseDown}>
        <span className="help-modal-title">
          {selected ? (
            <>
              <button
                className="help-back-btn"
                onClick={() => setSelectedSection(null)}
              >
                &larr;
              </button>
              {selected.title}
            </>
          ) : (
            "マニュアル"
          )}
        </span>
        <button className="help-modal-close" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="help-modal-body">
        {selected ? (
          <div className="help-section">{selected.content}</div>
        ) : (
          <>
            {highlightSections && highlightSections.length > 0 && (
              <div className="help-toc-group">
                <div className="help-toc-group-label">このレベルのヒント</div>
                {highlightSections.map((id) => {
                  const sec = sections.find((s) => s.id === id);
                  return sec ? (
                    <button
                      key={id}
                      className="help-toc-item help-toc-item-hint"
                      onClick={() => setSelectedSection(id)}
                    >
                      {sec.title}
                    </button>
                  ) : null;
                })}
              </div>
            )}
            <div className="help-toc-group">
              <div className="help-toc-group-label">全セクション</div>
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  className={`help-toc-item ${highlightSet.has(sec.id) ? "help-toc-item-hint" : ""}`}
                  onClick={() => setSelectedSection(sec.id)}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
