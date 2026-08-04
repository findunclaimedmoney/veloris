export default function LoadingState() {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center p-4 bg-[#06050a]">
      <div className="text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-[3px] border-pink-500/20 border-t-pink-500" />
        <p className="text-lg font-medium text-pink-400">Verifying your payment...</p>
        <p className="mt-2 text-xs text-slate-500">Connecting to Jess's studio</p>
      </div>
    </div>
  );
}