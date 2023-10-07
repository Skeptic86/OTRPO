export default interface IResult {
    count: number;
    next: string;
    previous?: string;
    results: Record<"name" | "url", string>[];
}
