export default function DocumentPreview({ fileUrl, fileName, className = "" }) {
  if (!fileUrl) {
    return <p className="text-xs text-text-secondary">No document attached.</p>;
  }

  const isImage = fileUrl.startsWith("data:image");

  if (isImage) {
    return (
      <img
        src={fileUrl}
        alt={fileName || "Document preview"}
        className={`rounded-lg border border-border object-contain max-h-72 w-full ${className}`}
      />
    );
  }

  return (
    <a
      href={fileUrl}
      download={fileName || "document"}
      className="inline-block text-xs font-semibold text-primary hover:underline"
    >
      Open Document {fileName ? `(${fileName})` : ""}
    </a>
  );
}
