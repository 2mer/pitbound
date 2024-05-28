type HookProps<T extends (props: any) => void> = T extends (
	props: infer R
) => void
	? R
	: never;

export default function HookComponent<T extends (props: any) => void>(hook: T) {
	return (props: HookProps<T>) => {
		hook(props);

		return null;
	};
}
