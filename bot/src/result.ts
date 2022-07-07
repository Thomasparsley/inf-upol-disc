export enum ResultState {
    Failed = 0,
    Success = 1,
}

export interface Matchers<T, E, TResult, EResult> {
    ok(value: T): TResult;
    err(error: E): EResult;
}

export class Result<T, E> {
    constructor(
        private readonly value: T | undefined,
        private readonly error: E | undefined,
        private readonly state: ResultState,
    ) { }

    public IsValid() {
        return this.state == ResultState.Success;
    }

    public IsInvalid() {
        return this.state == ResultState.Failed;
    }


    public Match<T, E, TResult, EResult>(matchers: Matchers<T, E, TResult, EResult>) {
        if (this.IsValid()) {
            return matchers.ok(this.value as unknown as T);
        }

        return matchers.err(this.error as unknown as E);
    }

    public static Ok<T, E>(value: T) {
        return new Result<T, E>(value, undefined, ResultState.Success);
    }

    public static Err<T, E>(error: E) {
        return new Result<T, E>(undefined, error, ResultState.Failed);
    }
}
