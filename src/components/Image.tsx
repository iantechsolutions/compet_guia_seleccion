// import * as fs from "fs/promises";
// import * as path from "path";

export function Image({
	src,
	alt,
	className,
	...props
}: { src: string; alt?: string; className?: string } & Record<string, any>) {
	return <img src={src} alt={alt} className={className} {...props} />;
}
