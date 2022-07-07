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

    public static ok<T, E>(value: T) {
        return new Result<T, E>(value, undefined, ResultState.Success);
    }

    public static err<T, E>(error: E) {
        return new Result<T, E>(undefined, error, ResultState.Failed);
    }

    public isValid() {
        return this.state == ResultState.Success;
    }

    public isInvalid() {
        return this.state == ResultState.Failed;
    }


    public match<T, E, TResult, EResult>(matchers: Matchers<T, E, TResult, EResult>) {
        if (this.isValid()) {
            return matchers.ok(this.value as unknown as T);
        }

        return matchers.err(this.error as unknown as E);
    }
}
