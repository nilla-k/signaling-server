export type Left<L> = { tag: 'left'; error: L };
export type Right<R> = { tag: 'right'; value: R };

export type Either<L, R> = Left<L> | Right<R>;

export const left = <L>(error: L): Left<L> => ({ tag: 'left', error });
export const right = <R>(value: R): Right<R> => ({ tag: 'right', value });

export type Error = {
    message: string
}