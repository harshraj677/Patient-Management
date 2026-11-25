import { Loader2 } from 'lucide-react'

export function LoadingState({ message = 'Loading patients...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-sm text-slate-500">
      <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      <p>{message}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center text-sm">
      <p className="font-medium text-red-600">{message}</p>
      <button onClick={onRetry} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
        Try again
      </button>
    </div>
  )
}
