
export const Ok = <T, E>(value: T) => new Result<T, E>(value, undefined, ResultState.Success);
export const Err = <T, E>(error: E) => new Result<T, E>(undefined, error, ResultState.Faulted);

export class Result<T, E> {
    private state: ResultStateValue;
    private value: T | undefined;
    private error: E | undefined;

    constructor(value: T | undefined, error: E | undefined, state: ResultStateValue) {
        this.state = state;
        this.value = value;
        this.error = error;
    }

    public IsValid() {
        return this.state == ResultState.Success;
    }

    public IsInvalid() {
        return this.state == ResultState.Faulted;
    }


    public Match<T, E extends Error, TResult, EResult>(matchers: Matchers<T, E, TResult, EResult>) {
        if (this.IsValid()) {
            return matchers.ok(this.value as unknown as T);
        }

        return matchers.err(this.error as unknown as E);
    }
}

type ResultStateValue = boolean;
interface IResultState {
    readonly Success: ResultStateValue;
    readonly Faulted: ResultStateValue;
}

export interface Matchers<T, E extends Error, TResult, EResult> {
    ok(value: T): TResult;
    err(error: E): EResult;
}

const ResultState: IResultState = {
    Success: true,
    Faulted: false,
}

