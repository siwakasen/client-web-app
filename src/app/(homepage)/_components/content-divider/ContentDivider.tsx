export default function ContentDivider({
  dividerText,
  title1,
  title2,
  description,
  titleClass,
}: {
  dividerText: string;
  title1: string;
  title2: string;
  description: string;
  titleClass: number;
}) {
  return (
    <div className="mb-12 py-4">
      <div className="flex items-center gap-4 mb-2">
        <p className="text-sm text-gray-600 font-medium tracking-wide uppercase py-6">
          {dividerText}
        </p>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2
            className={`font-georgia text-${(
              titleClass - 2
            ).toString()}xl md:text-${(
              titleClass - 1
            ).toString()}xl lg:text-${titleClass}xl font-bold text-gray-900 leading-tight`}
          >
            {title1}
            <br />
            {title2}
          </h2>
        </div>
        <div>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-georgia">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
