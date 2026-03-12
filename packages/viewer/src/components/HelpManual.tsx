import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type Props = {
  onClose: () => void;
  highlightSections?: string[];
};

type SectionCategory = "language" | "module" | "circuit";

type Section = {
  id: string;
  title: string;
  category: SectionCategory;
  content: ReactNode;
};

const categoryLabels: Record<SectionCategory, string> = {
  language: "言語",
  module: "モジュール",
  circuit: "回路解説",
};

const sections: Section[] = [
  {
    id: "syntax-var",
    category: "language",
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
    category: "language",
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
    category: "language",
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
    category: "module",
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
    category: "module",
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
    category: "module",
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
    id: "gate-on",
    category: "module",
    title: "ON: 常時1出力",
    content: (
      <>
        <p>入力なしで常に1を出力します。</p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th></tr>
          </thead>
          <tbody>
            <tr><td><code>out</code> / <code>_</code></td><td>出力</td></tr>
          </tbody>
        </table>
        <p>真理値表:</p>
        <table>
          <thead>
            <tr><th>出力</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント: NANDから常時1を作るには</summary>
          <p>NANDゲートの入力に何も接続しないと、デフォルト値(0)が使われます。NAND(0, 0) = 1 です。</p>
        </details>
      </>
    ),
  },
  {
    id: "gate-not",
    category: "module",
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
    category: "module",
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
    category: "module",
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
    category: "module",
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
    category: "module",
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
    category: "module",
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
  {
    id: "mod-bytein",
    category: "module",
    title: "BYTEIN: バイト入力",
    content: (
      <>
        <p>
          0〜255の整数を受け取り、8ビットに分解して出力するモジュールです。
          ビット0（o0）がLSB（最下位ビット）、ビット7（o7）がMSBです。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>o0</code></td><td>出力</td><td>ビット0（1の位）</td></tr>
            <tr><td><code>o1</code></td><td>出力</td><td>ビット1（2の位）</td></tr>
            <tr><td><code>o2</code></td><td>出力</td><td>ビット2（4の位）</td></tr>
            <tr><td><code>o3</code>〜<code>o7</code></td><td>出力</td><td>ビット3〜7</td></tr>
          </tbody>
        </table>
        <p>例: 値が42（= 00101010）のとき、o1=1, o3=1, o5=1、他は0</p>
      </>
    ),
  },
  {
    id: "mod-byteout",
    category: "module",
    title: "BYTEOUT: バイト出力",
    content: (
      <>
        <p>
          8本のビット入力を受け取り、整数（0〜255）に組み立てて出力するモジュールです。
          BYTEINの逆の動作をします。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>i0</code></td><td>入力</td><td>ビット0（1の位）</td></tr>
            <tr><td><code>i1</code></td><td>入力</td><td>ビット1（2の位）</td></tr>
            <tr><td><code>i2</code></td><td>入力</td><td>ビット2（4の位）</td></tr>
            <tr><td><code>i3</code>〜<code>i7</code></td><td>入力</td><td>ビット3〜7</td></tr>
          </tbody>
        </table>
        <p>出力値 = i0×1 + i1×2 + i2×4 + i3×8 + ... + i7×128</p>
      </>
    ),
  },
  {
    id: "circuit-half-adder",
    category: "circuit",
    title: "Half Adder: 半加算器",
    content: (
      <>
        <p>
          1ビット同士の足し算を行う回路です。
          2つの入力a, bの和をs（Sum: 合計）とc（Carry: 繰り上がり）で表します。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>a</code>, <code>b</code></td><td>入力</td><td>足し合わせる2つのビット</td></tr>
            <tr><td><code>s</code></td><td>出力</td><td>合計（Sum）</td></tr>
            <tr><td><code>c</code></td><td>出力</td><td>繰り上がり（Carry）</td></tr>
          </tbody>
        </table>
        <p>真理値表:</p>
        <table>
          <thead>
            <tr><th>a</th><th>b</th><th>s</th><th>c</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
            <tr><td>0</td><td>1</td><td>1</td><td>0</td></tr>
            <tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
            <tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>sの真理値表はXOR、cの真理値表はANDと同じです。</p>
        </details>
      </>
    ),
  },
  {
    id: "circuit-full-adder",
    category: "module",
    title: "ADD: 全加算器",
    content: (
      <>
        <p>
          下の桁からの繰り上がり（cin）も含めた1ビットの足し算を行います。
          Full Adderを連結すれば多ビットの足し算が可能です。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>i0</code></td><td>入力</td><td>入力A</td></tr>
            <tr><td><code>i1</code></td><td>入力</td><td>入力B</td></tr>
            <tr><td><code>i2</code></td><td>入力</td><td>繰り上がり入力（Carry In）</td></tr>
            <tr><td><code>o0</code></td><td>出力</td><td>合計（Sum）</td></tr>
            <tr><td><code>o1</code></td><td>出力</td><td>繰り上がり出力（Carry Out）</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>
            Half Adderを2段使います。まずa XOR bで仮の合計を出し、
            それとcinをもう一度XOR。繰り上がりは (a AND b) OR (仮の合計 AND cin) です。
          </p>
        </details>
      </>
    ),
  },
  {
    id: "circuit-decoder",
    category: "module",
    title: "DEC: デコーダ",
    content: (
      <>
        <p>
          3ビットの2進数入力を解読し、対応する8本の出力線の1つだけを有効にします。
          メモリのアドレス指定やマルチプレクサの制御に使われます。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>i0</code></td><td>入力</td><td>ビット0（LSB）</td></tr>
            <tr><td><code>i1</code></td><td>入力</td><td>ビット1</td></tr>
            <tr><td><code>i2</code></td><td>入力</td><td>ビット2（MSB）</td></tr>
            <tr><td><code>o0</code>〜<code>o7</code></td><td>出力</td><td>デコード結果（1つだけ1）</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>
            各出力はAND3で実現します。入力が0であるべき箇所にはNOTを通してから接続します。
            例: o5（= 101）は i0 AND NOT(i1) AND i2 です。
          </p>
        </details>
      </>
    ),
  },
  {
    id: "circuit-encoder",
    category: "module",
    title: "ENC: エンコーダ",
    content: (
      <>
        <p>
          デコーダの逆の動作をします。8本の入力線のうち1本が有効なとき、
          その番号を3ビットの2進数で出力します。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>i0</code>〜<code>i7</code></td><td>入力</td><td>8本の入力（1本だけ1）</td></tr>
            <tr><td><code>o0</code></td><td>出力</td><td>ビット0（LSB）</td></tr>
            <tr><td><code>o1</code></td><td>出力</td><td>ビット1</td></tr>
            <tr><td><code>o2</code></td><td>出力</td><td>ビット2（MSB）</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>
            各出力ビットは、そのビットが1になる入力線すべてのORです。
            例: o0は奇数番号の入力（i1, i3, i5, i7）のOR。
          </p>
        </details>
      </>
    ),
  },
  {
    id: "circuit-mux",
    category: "circuit",
    title: "MUX: マルチプレクサー",
    content: (
      <>
        <p>
          セレクタ信号で2つの入力のどちらかを選択して出力する回路です。
          データの切り替えやルーティングに使われます。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>a</code></td><td>入力</td><td>データ入力0</td></tr>
            <tr><td><code>b</code></td><td>入力</td><td>データ入力1</td></tr>
            <tr><td><code>sel</code></td><td>入力</td><td>セレクタ（0=a, 1=b）</td></tr>
            <tr><td><code>out</code> / <code>_</code></td><td>出力</td><td>選択された入力の値</td></tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr><th>sel</th><th>out</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>a</td></tr>
            <tr><td>1</td><td>b</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>
            各入力をANDゲートでセレクタの値に応じて有効/無効にし、
            結果をORで合流させます。
          </p>
        </details>
      </>
    ),
  },
  {
    id: "circuit-dmux",
    category: "circuit",
    title: "DMUX: デマルチプレクサー",
    content: (
      <>
        <p>
          MUXの逆で、1つの入力をセレクタ信号に応じて2つの出力のどちらかに振り分ける回路です。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>in</code></td><td>入力</td><td>データ入力</td></tr>
            <tr><td><code>sel</code></td><td>入力</td><td>セレクタ（0=a, 1=b）</td></tr>
            <tr><td><code>a</code></td><td>出力</td><td>sel=0のときinの値、それ以外は0</td></tr>
            <tr><td><code>b</code></td><td>出力</td><td>sel=1のときinの値、それ以外は0</td></tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr><th>sel</th><th>a</th><th>b</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>in</td><td>0</td></tr>
            <tr><td>1</td><td>0</td><td>in</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>
            入力信号をANDゲートでセレクタの値に応じてそれぞれの出力に振り分けます。
          </p>
        </details>
      </>
    ),
  },
  {
    id: "mod-flipflop",
    category: "module",
    title: "FLIPFLOP: 記憶素子",
    content: (
      <>
        <p>
          状態を記憶できる唯一のプリミティブモジュールです。
          Set信号で1を記憶し、Reset信号で0を記憶します。
          どちらも0なら前の状態を保持します。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>s</code></td><td>入力</td><td>Set（1を記憶）</td></tr>
            <tr><td><code>r</code></td><td>入力</td><td>Reset（0を記憶）</td></tr>
            <tr><td><code>q</code> / <code>_</code></td><td>出力</td><td>記憶されている値</td></tr>
          </tbody>
        </table>
        <p>動作表（テストは順番に実行され、状態が引き継がれます）:</p>
        <table>
          <thead>
            <tr><th>s</th><th>r</th><th>q</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>0</td><td>保持</td></tr>
            <tr><td>0</td><td>1</td><td>0</td></tr>
            <tr><td>1</td><td>0</td><td>1</td></tr>
            <tr><td>1</td><td>1</td><td>エラー</td></tr>
          </tbody>
        </table>
        <p>出力ポートは1つなので、WIRE文では <code>_</code> で指定できます。</p>
      </>
    ),
  },
  {
    id: "circuit-sr-latch",
    category: "circuit",
    title: "SR Latch: セット・リセットラッチ",
    content: (
      <>
        <p>
          FLIPFLOPを使った最も基本的な記憶回路です。
          Set(s)で1をセットし、Reset(r)で0にリセットします。
          両方0のときは前の値を保持します。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>s</code></td><td>入力</td><td>Set（1にする）</td></tr>
            <tr><td><code>r</code></td><td>入力</td><td>Reset（0にする）</td></tr>
            <tr><td><code>q</code></td><td>出力</td><td>記憶値</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>FLIPFLOPを1つ配置して、s, rの入力とqの出力をそのまま結線するだけです。</p>
        </details>
      </>
    ),
  },
  {
    id: "circuit-d-latch",
    category: "module",
    title: "DLATCH: データラッチ",
    content: (
      <>
        <p>
          1ビットのメモリです。Enable(e)が1のときにData(d)の値を記憶し、
          e=0のときは前の値を保持します。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>d</code></td><td>入力</td><td>記憶したい値</td></tr>
            <tr><td><code>e</code></td><td>入力</td><td>Enable（書き込み許可）</td></tr>
            <tr><td><code>q</code> / <code>_</code></td><td>出力</td><td>記憶されている値</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>
            FLIPFLOPのs,rをd,eから生成します:
            s = d AND e（dが1かつeが1でセット）、
            r = (NOT d) AND e（dが0かつeが1でリセット）。
          </p>
        </details>
      </>
    ),
  },
  {
    id: "circuit-register",
    category: "circuit",
    title: "Register: Dフリップフロップ（エッジトリガ）",
    content: (
      <>
        <p>
          D Latchが「レベルトリガ」（enable=1の間ずっと透過）であるのに対し、
          Registerは「エッジトリガ」（クロックの立ち上がりの瞬間だけデータを取り込む）です。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>d</code></td><td>入力</td><td>記憶したい値</td></tr>
            <tr><td><code>clk</code></td><td>入力</td><td>クロック信号</td></tr>
            <tr><td><code>q</code> / <code>_</code></td><td>出力</td><td>記憶されている値</td></tr>
          </tbody>
        </table>
        <p>マスター・スレーブ構成:</p>
        <ul>
          <li>マスターDLATCH: d=入力, e=NOT clk（clk=0で取り込み）</li>
          <li>スレーブDLATCH: d=マスター出力, e=clk（clk=1で出力）</li>
        </ul>
        <details>
          <summary>ヒント</summary>
          <p>
            NOTでclkを反転してマスターのeに接続し、
            clkをそのままスレーブのeに接続します。
            マスターの出力をスレーブの入力dに繋げば完成です。
          </p>
        </details>
      </>
    ),
  },
  {
    id: "circuit-byte-memory",
    category: "module",
    title: "Byte Memory: バイトメモリ",
    content: (
      <>
        <p>
          DLATCHを8個並列に並べて、8ビット（1バイト）の値を記憶する回路です。
          書き込み信号wは全ビットで共有します。
        </p>
        <table>
          <thead>
            <tr><th>ポート</th><th>方向</th><th>説明</th></tr>
          </thead>
          <tbody>
            <tr><td><code>d</code> (BYTEIN)</td><td>入力</td><td>記憶したい8ビット値</td></tr>
            <tr><td><code>w</code> (BITIN)</td><td>入力</td><td>書き込み信号</td></tr>
            <tr><td><code>q</code> (BYTEOUT)</td><td>出力</td><td>記憶されている8ビット値</td></tr>
          </tbody>
        </table>
        <details>
          <summary>ヒント</summary>
          <p>
            DLATCHを8個作り、各ビットの入力(d o0〜o7)をDLATCHのdに、
            wをすべてのDLATCHのeに接続します。
            各DLATCHの出力qをBYTEOUTの対応するビット(q i0〜i7)に繋ぎます。
          </p>
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
            {(["language", "module", "circuit"] as SectionCategory[]).map((cat) => (
              <div className="help-toc-group" key={cat}>
                <div className="help-toc-group-label">{categoryLabels[cat]}</div>
                {sections
                  .filter((sec) => sec.category === cat)
                  .map((sec) => (
                    <button
                      key={sec.id}
                      className={`help-toc-item ${highlightSet.has(sec.id) ? "help-toc-item-hint" : ""}`}
                      onClick={() => setSelectedSection(sec.id)}
                    >
                      {sec.title}
                    </button>
                  ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
