export function ErrorText({ err }: { err?: string }) {
  return <span className=" text-xs text-red-600">{err ?? ''}</span>;
}
