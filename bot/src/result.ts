export class Result<T> {
    private state: ResultStateValue;
    private value: T | undefined;
    private exception: Error | undefined;

    constructor(input: T | Error) {
        if (input instanceof Error) {
            this.state = ResultState.Faulted;
            this.value = undefined;
            this.exception = input;
            return;
        }

        this.state = ResultState.Success;
        this.value = input;
        this.exception = undefined;
    }

    public IsValid() {
        return this.state == ResultState.Success;
    }

    public IsInvalid() {
        return this.state == ResultState.Faulted;
    }

    public Match<TResult>(success: (value: T) => TResult, exception: (error: Error) => TResult): TResult {
        if (this.IsValid()) {
            return success(this.value as T);
        }

        return exception(this.exception as Error);
    }
}

interface IResultState {
    readonly Success: ResultStateValue;
    readonly Faulted: ResultStateValue;
}

type ResultStateValue = boolean;
const ResultState: IResultState = {
    Success: true,
    Faulted: false,
}

export const Ok = <T>(value: T) => new Result<T>(value);
export const Err = (message: string) => new Result(new Error(message));