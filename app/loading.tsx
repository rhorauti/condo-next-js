export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border border-white/20" />

          <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-purple-400" />

          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 blur-md opacity-70 animate-pulse" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-wide">Aguarde...</h1>

          <p className="text-white/60 text-sm tracking-wider">
            Melhorando a sua experiência...
          </p>
        </div>

        <div className="flex gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
