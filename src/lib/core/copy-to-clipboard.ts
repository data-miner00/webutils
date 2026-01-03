import { toast } from 'svelte-sonner';

export function clickToCopy(node: HTMLElement, target?: string) {
	async function copyText() {
		let text = target ? (document.querySelector(target)! as any).innerText : node.innerText;

		const date = new Date();

		try {
			await navigator.clipboard.writeText(text);

			toast.success('Copied to clipboard', {
				description: date.toUTCString(),
				action: {
					label: 'Ok',
					onClick: () => console.info('Ok')
				}
			});
		} catch (error) {
			toast.error('Failed to copy to clipboard', {
				description: date.toUTCString(),
				action: {
					label: 'Ok',
					onClick: () => console.info('Ok')
				}
			});
		}
	}

	node.addEventListener('click', copyText);

	return () => {
		node.removeEventListener('click', copyText);
	};
}

export async function copyText(text: string) {
	const date = new Date();

	try {
		await navigator.clipboard.writeText(text);

		toast.success('Copied to clipboard', {
			description: date.toUTCString(),
			action: {
				label: 'Ok',
				onClick: () => console.info('Ok')
			}
		});
	} catch (error) {
		toast.error('Failed to copy to clipboard', {
			description: date.toUTCString(),
			action: {
				label: 'Ok',
				onClick: () => console.info('Ok')
			}
		});
	}
}
