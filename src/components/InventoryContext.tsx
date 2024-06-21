import { createContext } from '@sgty/kontext-react';
import { useState } from 'react';

export default createContext(() => {
	return useState(false);
});
