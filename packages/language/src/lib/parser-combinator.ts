export type ParseResult<T> = ParseResultSuccess<T> | ParseResultFailed;
export type ParseResultSuccess<T> = { success: true; data: T; rest: string[] };
export type ParseResultFailed = { success: false; rest: string[] };

export type Parser<T> = (inputs: string[]) => ParseResult<T>;

const success = <T>(data: T, rest: string[]): ParseResultSuccess<T> => ({
  success: true,
  data,
  rest,
});
const fail = (rest: string[]): ParseResultFailed => ({ success: false, rest });

export const anyChar: Parser<string> = (inputs) => {
  const [data, ...rest] = inputs;
  if (data == null) return fail(inputs);
  return success(data, rest);
};

export const eof: Parser<null> = (inputs) => {
  return inputs.length === 0 ? success(null, []) : fail(inputs);
};

export const char =
  (c: string): Parser<string> =>
  (inputs) => {
    const [data, ...rest] = inputs;
    return data === c ? success(data, rest) : fail(inputs);
  };

export const or =
  <T>(...parsers: Parser<T>[]): Parser<T> =>
  (inputs) => {
    for (const parser of parsers) {
      const result = parser(inputs);
      if (result.success) return result;
    }
    return fail(inputs);
  };

export const not =
  (parser: Parser<unknown>): Parser<null> =>
  (inputs) => {
    const result = parser(inputs);
    return !result.success ? success(null, inputs) : fail(inputs);
  };

export const seq =
  <T>(...parsers: Parser<T>[]): Parser<T[]> =>
  (inputs) => {
    let rest = inputs;
    const results: T[] = [];
    for (const parser of parsers) {
      const result = parser(rest);
      if (!result.success) return result;
      rest = result.rest;
      results.push(result.data);
    }
    return success(results, rest);
  };

export const rep =
  <T>(parser: Parser<T>, min = 0, max = Number.MAX_SAFE_INTEGER): Parser<T[]> =>
  (inputs) => {
    if (min < 0) throw Error(`parameter min must greater than or equals to 0`);
    if (max < min)
      throw Error(
        `parameter max must greater than or equals to parameter min:${min}`,
      );

    let rest = inputs;
    const results: T[] = [];
    for (let i = 0; i < max; i++) {
      const result = parser(rest);
      if (!result.success) break;
      rest = result.rest;
      results.push(result.data);
    }
    if (results.length < min) return fail(inputs);
    return success(results, rest);
  };

export const sub =
  <T, U>(a: Parser<T>, b: Parser<U>): Parser<T> =>
  (inputs) => {
    const notBResult = not(b)(inputs);
    if (!notBResult.success) return fail(inputs);
    return a(inputs);
  };

export const str =
  (charSequence: string): Parser<string> =>
  (inputs) => {
    const parser = seq(...[...charSequence].map((c) => char(c)));
    const result = parser(inputs);
    return result.success ? success(result.data.join(""), result.rest) : result;
  };

export const mapResult = <T, U>(
  parser: Parser<T>,
  fn: (data: T) => U,
): Parser<U> => {
  return (inputs) => {
    const result = parser(inputs);
    if (!result.success) return result;
    return { ...result, data: fn(result.data) };
  };
};
