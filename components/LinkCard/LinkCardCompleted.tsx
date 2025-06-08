const LinkCardCompleted = ({ ogData, openInNewTab = true }: any) => {
  const target = openInNewTab ? "_blank" : "_self";

  return (
    <div className="border border-solid border-gray-300 rounded-lg overflow-hidden">
      <a
        href={ogData.url}
        target={target}
        rel={openInNewTab ? "noopener noreferrer" : ""}
        className="block"
      >
        <div className="flex flex-col sm:flex-row">
          {ogData.image && (
            <div className="w-full sm:w-1/3">
              <img
                src={ogData.image}
                alt={ogData.siteName}
                className="w-full h-auto"
              />
            </div>
          )}
          {ogData.title ? (
            <div className="flex-1 flex flex-col p-4">
              <p className="text-xs font-bold break-all truncate-2-lines">
                {ogData.title}
              </p>
              <p className="text-xs break-all truncate-2-lines">
                {ogData.description}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-4">
              <p className="text-xs font-bold break-all truncate-2-lines">
                外部サイトを開く
              </p>
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default LinkCardCompleted;
