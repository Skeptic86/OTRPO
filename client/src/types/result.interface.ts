type TResultsKeys = "name" | "url";

export default interface IResult {
    count: number;
    next: string;
    previous?: string;
    results: Record<TResultsKeys, string>[];
}
