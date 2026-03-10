export type ParseResult<T> = ParseResultSuccess<T> | ParseResultFailed;
export type ParseResultSuccess<T> = { success: true; data: T; pos: number };
export type ParseResultFailed = { success: false; pos: number };

export type Parser<T> = (input: string, pos: number) => ParseResult<T>;

const success = <T>(data: T, pos: number): ParseResultSuccess<T> => ({
  success: true,
  data,
  pos,
});
const fail = (pos: number): ParseResultFailed => ({ success: false, pos });

export const anyChar: Parser<string> = (input, pos) => {
  if (pos >= input.length) return fail(pos);
  return success(input[pos]!, pos + 1);
};

export const eof: Parser<null> = (input, pos) => {
  return pos >= input.length ? success(null, pos) : fail(pos);
};

export const char =
  (c: string): Parser<string> =>
  (input, pos) => {
    if (pos >= input.length) return fail(pos);
    return input[pos] === c ? success(c, pos + 1) : fail(pos);
  };

export const or =
  <T>(...parsers: Parser<T>[]): Parser<T> =>
  (input, pos) => {
    for (const parser of parsers) {
      const result = parser(input, pos);
      if (result.success) return result;
    }
    return fail(pos);
  };

export const not =
  (parser: Parser<unknown>): Parser<null> =>
  (input, pos) => {
    const result = parser(input, pos);
    return !result.success ? success(null, pos) : fail(pos);
  };

export const seq =
  <T>(...parsers: Parser<T>[]): Parser<T[]> =>
  (input, pos) => {
    let currentPos = pos;
    const results: T[] = [];
    for (const parser of parsers) {
      const result = parser(input, currentPos);
      if (!result.success) return fail(result.pos);
      currentPos = result.pos;
      results.push(result.data);
    }
    return success(results, currentPos);
  };

export const rep =
  <T>(parser: Parser<T>, min = 0, max = Number.MAX_SAFE_INTEGER): Parser<T[]> =>
  (input, pos) => {
    if (min < 0) throw Error(`parameter min must greater than or equals to 0`);
    if (max < min)
      throw Error(
        `parameter max must greater than or equals to parameter min:${min}`,
      );

    let currentPos = pos;
    const results: T[] = [];
    for (let i = 0; i < max; i++) {
      const result = parser(input, currentPos);
      if (!result.success) break;
      currentPos = result.pos;
      results.push(result.data);
    }
    if (results.length < min) return fail(pos);
    return success(results, currentPos);
  };

export const sub =
  <T, U>(a: Parser<T>, b: Parser<U>): Parser<T> =>
  (input, pos) => {
    const notBResult = not(b)(input, pos);
    if (!notBResult.success) return fail(pos);
    return a(input, pos);
  };

export const str =
  (charSequence: string): Parser<string> =>
  (input, pos) => {
    if (pos + charSequence.length > input.length) return fail(pos);
    for (let i = 0; i < charSequence.length; i++) {
      if (input[pos + i] !== charSequence[i]) return fail(pos);
    }
    return success(charSequence, pos + charSequence.length);
  };

export const mapResult = <T, U>(
  parser: Parser<T>,
  fn: (data: T) => U,
): Parser<U> => {
  return (input, pos) => {
    const result = parser(input, pos);
    if (!result.success) return result;
    return { ...result, data: fn(result.data) };
  };
};
