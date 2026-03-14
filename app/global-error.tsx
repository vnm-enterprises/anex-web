// app/_global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              {error.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}