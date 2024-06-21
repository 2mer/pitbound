import { createContext } from '@sgty/kontext-react';
import { useRef } from 'react';

export default createContext(() => {
	return { ref: useRef<HTMLDivElement>(null) };
});
