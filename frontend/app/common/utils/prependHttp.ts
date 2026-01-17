interface Options {
  https?: boolean,
}

export default function (url: string, options: Options) {
	if (typeof url !== 'string') {
		throw new TypeError(`Expected \`url\` to be of type \`string\`, got \`${typeof url}\``);
	}

	url = url.trim();

	options = {
		https: true,
		...options
	};

	if (/^\.*\/|^(?!localhost)\w+:/.test(url)) {
		return url;
	}

	return url.replace(/^(?!(?:\w+:)?\/\/)/, options.https ? 'https://' : 'http://');
};