export function ProfileFooter() {
  return (
    <div className="mt-16 pt-8 pb-6 border-t border-gray-200 text-center">
      <p className="text-sm text-gray-500">
        Powered by{' '}
        <a href="/" className="text-string-mint hover:text-string-mint-light font-medium transition-colors">
          <img
            src="/logo-dark.svg"
            alt="String"
            className="h-4 inline"
          />
        </a>
      </p>
    </div>
  );
}