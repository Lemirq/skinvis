import React from 'react';

const Navbar = () => {
	return (
		<nav className="rounded-2xl flex items-start fixed top-3 z-50 w-full mx-auto">
			<div className="max-w-6xl flex flex-wrap items-center justify-between mx-auto p-4 bg-zinc-900 rounded-2xl w-full">
				<a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
					<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Skinvis.ai</span>
				</a>
			</div>
		</nav>
	);
};

export default Navbar;
